"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_module_1 = require("../db/db.module");
const schema = __importStar(require("../db/schema"));
const XP_CHECKIN = 10;
const XP_SALE = 50;
let RoutesService = class RoutesService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(vendorId, date) {
        const rows = await this.db.select().from(schema.routes);
        return rows.filter((r) => (!vendorId || r.vendorId === vendorId) &&
            (!date || r.date.toISOString().startsWith(date)));
    }
    async findOne(id) {
        const [route] = await this.db
            .select()
            .from(schema.routes)
            .where((0, drizzle_orm_1.eq)(schema.routes.id, id));
        if (!route)
            throw new common_1.NotFoundException("Rota não encontrada");
        const clients = await this.db
            .select()
            .from(schema.routeClients)
            .where((0, drizzle_orm_1.eq)(schema.routeClients.routeId, id));
        return { ...route, clients };
    }
    async create(dto) {
        const [route] = await this.db
            .insert(schema.routes)
            .values({
            vendorId: dto.vendorId,
            date: new Date(dto.date),
            totalClients: dto.clients.length,
        })
            .returning();
        const clientRows = dto.clients.map((c) => ({
            routeId: route.id,
            clientId: c.clientId,
            order: c.order,
        }));
        const clients = await this.db
            .insert(schema.routeClients)
            .values(clientRows)
            .returning();
        return { ...route, clients };
    }
    async checkIn(routeId, dto) {
        const [routeClient] = await this.db
            .select()
            .from(schema.routeClients)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.routeClients.routeId, routeId), (0, drizzle_orm_1.eq)(schema.routeClients.clientId, dto.clientId)));
        if (!routeClient)
            throw new common_1.NotFoundException("Cliente não encontrado na rota");
        await this.db
            .update(schema.routeClients)
            .set({ status: "visitado", checkInTime: new Date() })
            .where((0, drizzle_orm_1.eq)(schema.routeClients.id, routeClient.id));
        await this.db.insert(schema.checkIns).values({
            vendorId: (await this.findOne(routeId)).vendorId,
            clientId: dto.clientId,
            lat: dto.lat,
            lng: dto.lng,
            photoUrl: dto.photoUrl,
            notes: dto.notes,
        });
        const route = await this.db
            .select()
            .from(schema.routes)
            .where((0, drizzle_orm_1.eq)(schema.routes.id, routeId));
        const vendorId = route[0].vendorId;
        await this.awardXp(vendorId, XP_CHECKIN, "checkin", `Check-in: ${dto.clientId}`);
        const visited = await this.db
            .select()
            .from(schema.routeClients)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.routeClients.routeId, routeId)));
        const visitedCount = visited.filter((c) => c.status !== "pendente").length;
        await this.db
            .update(schema.routes)
            .set({ visitedClients: visitedCount, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema.routes.id, routeId));
        return { success: true, xpEarned: XP_CHECKIN };
    }
    async registerNoSale(routeId, dto) {
        const [routeClient] = await this.db
            .select()
            .from(schema.routeClients)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.routeClients.routeId, routeId), (0, drizzle_orm_1.eq)(schema.routeClients.clientId, dto.clientId)));
        if (!routeClient)
            throw new common_1.NotFoundException("Cliente não encontrado na rota");
        await this.db
            .update(schema.routeClients)
            .set({
            status: "sem_venda",
            visitReason: dto.visitReason,
            checkInTime: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema.routeClients.id, routeClient.id));
        return { success: true };
    }
    async updateClientOrder(routeId, clients) {
        await this.findOne(routeId);
        for (const { clientId, order } of clients) {
            await this.db
                .update(schema.routeClients)
                .set({ order })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.routeClients.routeId, routeId), (0, drizzle_orm_1.eq)(schema.routeClients.clientId, clientId)));
        }
        return this.findOne(routeId);
    }
    async awardXp(vendorId, xp, type, description) {
        await Promise.all([
            this.db
                .update(schema.vendors)
                .set({ xp: schema.vendors.xp })
                .where((0, drizzle_orm_1.eq)(schema.vendors.id, vendorId)),
            this.db
                .insert(schema.xpActivities)
                .values({ vendorId, type, description, xpEarned: xp }),
        ]);
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Function])
], RoutesService);
//# sourceMappingURL=routes.service.js.map