import { Article } from '../entities/article.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Override, CrudRequest } from '@nestjsx/crud';

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>  {
  constructor(@InjectRepository(Article) repo) {
    super(repo);
  }

  @Override('getManyBase')
  getMany(req: CrudRequest) {
    return this.repo.find({ deleted: false });
  }
}
