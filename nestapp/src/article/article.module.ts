import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { Article } from '../entities/article.entity';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
