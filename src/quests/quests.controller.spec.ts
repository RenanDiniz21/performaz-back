import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { QuestsController } from "./quests.controller";
import { QuestsService } from "./quests.service";

describe("QuestsController", () => {
	let app: INestApplication;
	const service = {
		create: jest.fn((dto) => ({ id: "quest-1", progress: [], ...dto })),
	};

	beforeEach(async () => {
		service.create.mockClear();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [QuestsController],
			providers: [{ provide: QuestsService, useValue: service }],
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

	it("keeps create quest DTO fields after validation", async () => {
		await request(app.getHttpServer())
			.post("/quests")
			.send({
				title: "Daily visits",
				description: "Visit five clients today",
				type: "diaria",
				category: "visitas",
				target: 5,
				xpReward: 120,
				icon: "target",
				active: true,
				startDate: "2026-06-02T00:00:00.000Z",
				endDate: "2026-06-02T23:59:59.000Z",
				assignedToAll: false,
				vendorIds: ["vendor-1"],
			})
			.expect(201);

		expect(service.create).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Daily visits",
				type: "diaria",
				category: "visitas",
				xpReward: 120,
				assignedToAll: false,
				vendorIds: ["vendor-1"],
			}),
		);
	});
});
