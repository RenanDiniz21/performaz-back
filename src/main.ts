import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix("api");
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	app.useGlobalFilters(new AllExceptionsFilter());

	const config = new DocumentBuilder()
		.setTitle("Performaz API")
		.setDescription("API do sistema de vendas gamificado Performaz")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document);

	const port = process.env.PORT ?? 3333;
	await app.listen(port);
	console.log(`🚀 Performaz API running on http://localhost:${port}/api`);
	console.log(`📖 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
