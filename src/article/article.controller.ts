import { Controller } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from '../entities/article.entity';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
} from '@nestjsx/crud';

@Crud({
  model: {
    type: Article,
  },
})
@Controller('article')
export class ArticleController implements CrudController<Article> {
  constructor(public service: ArticleService) {}

  get base(): CrudController<Article> {
    return this;
  }

  @Override('deleteOneBase')
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    const selectedArticle = await this.base.getOneBase(req);
    selectedArticle.deleted = true;
    return await this.base.updateOneBase(req, selectedArticle);
  }
}
