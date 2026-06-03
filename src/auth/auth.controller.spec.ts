import { Test, type TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
	let controller: AuthController;
	const authService = {
		loginManager: jest.fn(),
		loginVendor: jest.fn(),
		refresh: jest.fn(),
		changeVendorPassword: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthService, useValue: authService }],
		}).compile();

		controller = module.get(AuthController);
	});

	it("delegates manager login to AuthService", () => {
		const dto = { email: "admin@performaz.com", password: "admin123" };
		authService.loginManager.mockReturnValue({
			accessToken: "access",
			refreshToken: "refresh",
		});

		expect(controller.loginManager(dto)).toEqual({
			accessToken: "access",
			refreshToken: "refresh",
		});
		expect(authService.loginManager).toHaveBeenCalledWith(dto);
	});

	it("delegates vendor password change using the authenticated vendor id", async () => {
		const dto = {
			currentPassword: "vendor123",
			newPassword: "newVendor123",
		};
		authService.changeVendorPassword.mockResolvedValue({ success: true });

		await expect(
			controller.changeVendorPassword(
				{
					user: {
						sub: "vendor-1",
						email: "vendor@performaz.com",
						role: "VENDEDOR",
					},
				},
				dto,
			),
		).resolves.toEqual({ success: true });
		expect(authService.changeVendorPassword).toHaveBeenCalledWith(
			"vendor-1",
			dto,
		);
	});
});
