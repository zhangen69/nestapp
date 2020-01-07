import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from 'nestjs-dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService('./.env');
  const envPort = configService.get('PORT');
  console.log(`Server is running on http://localhost:${envPort}`);
  await app.listen(envPort);
}
bootstrap();
