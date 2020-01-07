import { ArticleService } from './article.service';
import { Article } from '../entities/article.entity';
import { CrudController, CrudRequest } from '@nestjsx/crud';
export declare class ArticleController implements CrudController<Article> {
    service: ArticleService;
    constructor(service: ArticleService);
    get base(): CrudController<Article>;
    deleteOne(req: CrudRequest): Promise<Article>;
}
