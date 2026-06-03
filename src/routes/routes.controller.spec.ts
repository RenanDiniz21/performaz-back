import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RoutesController } from "./routes.controller";
import { RoutesService } from "./routes.service";

describe("RoutesController", () => {
	let app: INestApplication;
	const service = {
		create: jest.fn((dto) => ({ id: "route-1", ...dto })),
		registerNoSale: jest.fn(() => ({ success: true })),
	};

	beforeEach(async () => {
		service.create.mockClear();
		service.registerNoSale.mockClear();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [RoutesController],
			providers: [{ provide: RoutesService, useValue: service }],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue({ canActivate: () => true })
			.compile();

		app = module.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({ whitelist: true, transform: true }),
		);
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("keeps create route DTO fields after validation", async () => {
		await request(app.getHttpServer())
			.post("/routes")
			.send({
				vendorId: "vendor-1",
				date: "2026-06-01",
				clients: [
					{ clientId: "client-1", order: 1 },
					{ clientId: "client-2", order: 2 },
				],
			})
			.expect(201);

		expect(service.create).toHaveBeenCalledWith(
			expect.objectContaining({
				vendorId: "vendor-1",
				date: "2026-06-01",
				clients: [
					{ clientId: "client-1", order: 1 },
					{ clientId: "client-2", order: 2 },
				],
			}),
		);
	});

	it("keeps no-sale visit reason after validation", async () => {
		await request(app.getHttpServer())
			.post("/routes/route-1/no-sale")
			.send({
				clientId: "client-1",
				visitReason: "sem_interesse",
			})
			.expect(201);

		expect(service.registerNoSale).toHaveBeenCalledWith("route-1", {
			clientId: "client-1",
			visitReason: "sem_interesse",
		});
	});
});
