import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

let app: any;

async function bootstrap() {
	if (!app) {
		app = await NestFactory.create(AppModule);
		app.setGlobalPrefix("api");
		app.enableCors();
		app.useGlobalPipes(
			new ValidationPipe({ whitelist: true, transform: true }),
		);
		app.useGlobalFilters(new AllExceptionsFilter());
		await app.init();
	}
	return app;
}

export default async function handler(req: any, res: any) {
	const app = await bootstrap();
	const instance = app.getHttpAdapter().getInstance();
	return instance(req, res);
}
