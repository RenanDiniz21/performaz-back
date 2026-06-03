import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { VendorsController } from "./vendors.controller";
import { VendorsService } from "./vendors.service";

describe("VendorsController", () => {
	let app: INestApplication;
	const service = {
		create: jest.fn((dto) => ({ id: "vendor-1", ...dto })),
	};

	beforeEach(async () => {
		service.create.mockClear();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [VendorsController],
			providers: [{ provide: VendorsService, useValue: service }],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue({ canActivate: () => true })
			.compile();

		app = module.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("keeps create vendor DTO fields after validation", async () => {
		await request(app.getHttpServer())
			.post("/vendors")
			.send({
				name: "Codex Vendor",
				email: "codex.vendor@performaz.com",
				matricula: "V-CODEX",
				password: "vendor123",
				phone: "(11) 90000-0000",
				region: "Sao Paulo",
			})
			.expect(201);

		expect(service.create).toHaveBeenCalledWith(
			expect.objectContaining({
				email: "codex.vendor@performaz.com",
				password: "vendor123",
				matricula: "V-CODEX",
			}),
		);
	});
});
