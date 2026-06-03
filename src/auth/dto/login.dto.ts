import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
	@ApiProperty({ example: "gestor@performaz.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ example: "senha123" })
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class VendorLoginDto {
	@ApiProperty({ example: "V001" })
	@IsString()
	@IsNotEmpty()
	matricula: string;

	@ApiProperty({ example: "senha123" })
	@IsString()
	@IsNotEmpty()
	password: string;
}

export class RefreshTokenDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	refreshToken: string;
}

export class ChangeVendorPasswordDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	currentPassword: string;

	@ApiProperty({ minLength: 6 })
	@IsString()
	@MinLength(6)
	newPassword: string;
}
