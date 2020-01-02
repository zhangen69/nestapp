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

  // @Override()
  // getMany(@ParsedRequest() req: CrudRequest) {
  //   // req.options.query.filter = [
  //   //   { field: 'deleted', value: false, operator: 'eq' },
  //   // ];
  //   // req.parsed.paramsFilter = [
  //   //   { field: 'deleted', value: false, operator: 'eq' },
  //   // ];
  //   req.options.query.filter = {
  //     $and: [{ deleted: false }],
  //   };
  //   return this.base.getManyBase(req);
  //   return this.base.getManyBase(req).then((articles: Article[]) => {
  //     console.log(articles);
  //     return articles.filter(x => !x.deleted);
  //   });
  // }

  @Override('deleteOneBase')
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    const selectedArticle = await this.base.getOneBase(req);
    selectedArticle.deleted = true;
    return await this.base.updateOneBase(req, selectedArticle);
  }
}
