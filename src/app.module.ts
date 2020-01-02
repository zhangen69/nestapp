import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from 'nestjs-dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Article } from './entities/article.entity';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [DashboardModule, ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [Article],
    synchronize: true,
  }), ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
