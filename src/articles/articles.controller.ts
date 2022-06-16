import { Controller, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Post()
  async create() {
    return await this.articleService.createArticle();
  }
}
