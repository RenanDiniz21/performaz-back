import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("Performaz API (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix("api");
		app.useGlobalPipes(
			new ValidationPipe({ whitelist: true, transform: true }),
		);
		await app.init();
	});

	it("rejects invalid manager login requests", () => {
		return request(app.getHttpServer())
			.post("/api/auth/login")
			.send({})
			.expect(400);
	});

	it("protects the quests endpoint", () => {
		return request(app.getHttpServer())
			.post("/api/quests")
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
				assignedToAll: true,
			})
			.expect(401);
	});

	afterEach(async () => {
		await app.close();
	});
});
