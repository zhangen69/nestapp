import { Article } from '../entities/article.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequest } from '@nestjsx/crud';
export declare class ArticleService extends TypeOrmCrudService<Article> {
    constructor(repo: any);
    getMany(req: CrudRequest): Promise<Article[]>;
}
