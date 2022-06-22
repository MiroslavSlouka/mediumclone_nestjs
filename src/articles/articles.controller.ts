import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
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
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CommentsService } from './comments.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import { IArticlesResponse } from './types/articlesResponse.interface';
import { ICommentResponse } from './types/commentResponse.interface';
import { ICommentsResponse } from './types/commentsResponse.interface';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articleService: ArticlesService,
    private readonly commentService: CommentsService,
  ) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IArticlesResponse> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Get('/feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currenUserId: number,
    @Query() query: any,
  ): Promise<IArticlesResponse> {
    return await this.articleService.getFeed(currenUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
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

  @Put('/:slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard)
  async removeArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.removeArticleFromFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get('/:slug/comments')
  async getCommentsForArticle(
    @Param('slug') slug: string,
  ): Promise<ICommentsResponse> {
    return await this.commentService.getComments(slug);
  }

  @Post('/:slug/comments')
  @UseGuards(AuthGuard)
  async createComment(
    @User() currentUser: UserEntity,
    @Body('comment') createCommentDto: CreateCommentDto,
    @Param('slug') slug: string,
  ): Promise<ICommentResponse> {
    const comment = await this.commentService.createComment(
      currentUser,
      slug,
      createCommentDto,
    );
    return this.commentService.buildCommentResponse(comment);
  }

  @Delete('/:slug/comments/:commentId')
  @UseGuards()
  async deleteComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    await this.commentService.deleteComment(commentId, slug, currentUserId);
  }
}
