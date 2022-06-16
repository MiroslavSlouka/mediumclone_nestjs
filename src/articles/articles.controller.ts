import { User } from '@app/users/decorators/user.decorator';
import { AuthGuard } from '@app/users/guards/auth.guard';
import { UserEntity } from '@app/users/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/createArtocle.dto';
import { IArticleResponse } from './types/articleResponse.interface';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get('/:slug')
  async getArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.getBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return await this.articleService.deleteBySlug(slug, currentUserId);
  }
}
