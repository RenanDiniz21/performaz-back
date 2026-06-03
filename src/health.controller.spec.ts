import { HealthController } from "./health.controller";

describe("HealthController", () => {
	it("returns a public health payload", () => {
		const controller = new HealthController();

		expect(controller.getHealth()).toEqual({
			status: "ok",
			service: "performaz-api",
		});
	});
});
