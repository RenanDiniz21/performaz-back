"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Performaz API")
        .setDescription("API do sistema de vendas gamificado Performaz")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("docs", app, document);
    const port = process.env.PORT ?? 3333;
    await app.listen(port);
    console.log(`🚀 Performaz API running on http://localhost:${port}/api`);
    console.log(`📖 Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map