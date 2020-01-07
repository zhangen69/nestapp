"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nestjs_dotenv_1 = require("nestjs-dotenv");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = new nestjs_dotenv_1.ConfigService('./.env');
    const envPort = configService.get('PORT');
    console.log(`Server is running on http://localhost:${envPort}`);
    await app.listen(envPort);
}
bootstrap();
//# sourceMappingURL=main.js.map