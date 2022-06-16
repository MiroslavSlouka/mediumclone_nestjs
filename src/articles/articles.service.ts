import { UserEntity } from '@app/users/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArtocle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async getBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ slug });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async deleteBySlug(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.getBySlug(slug);
    console.log('article', article);

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete(article);
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString()
    );
  }
}
