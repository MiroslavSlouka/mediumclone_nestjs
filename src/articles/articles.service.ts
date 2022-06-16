import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlesService {
  async createArticle(): Promise<any> {
    return 'createArticle';
  }
}
