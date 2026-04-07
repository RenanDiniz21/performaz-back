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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const db_module_1 = require("../db/db.module");
const schema = __importStar(require("../db/schema"));
let ClientsService = class ClientsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(search) {
        if (search) {
            return this.db
                .select()
                .from(schema.clients)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.clients.name, `%${search}%`), (0, drizzle_orm_1.ilike)(schema.clients.cnpj, `%${search}%`)));
        }
        return this.db.select().from(schema.clients);
    }
    async findOne(id) {
        const [client] = await this.db
            .select()
            .from(schema.clients)
            .where((0, drizzle_orm_1.eq)(schema.clients.id, id));
        if (!client)
            throw new common_1.NotFoundException("Cliente não encontrado");
        return client;
    }
    async create(dto) {
        const exists = await this.db
            .select({ id: schema.clients.id })
            .from(schema.clients)
            .where((0, drizzle_orm_1.eq)(schema.clients.cnpj, dto.cnpj));
        if (exists.length)
            throw new common_1.ConflictException("CNPJ já cadastrado");
        const [client] = await this.db
            .insert(schema.clients)
            .values(dto)
            .returning();
        return client;
    }
    async update(id, dto) {
        await this.findOne(id);
        const [client] = await this.db
            .update(schema.clients)
            .set({ ...dto, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema.clients.id, id))
            .returning();
        return client;
    }
    async remove(id) {
        await this.findOne(id);
        await this.db.delete(schema.clients).where((0, drizzle_orm_1.eq)(schema.clients.id, id));
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Function])
], ClientsService);
//# sourceMappingURL=clients.service.js.map