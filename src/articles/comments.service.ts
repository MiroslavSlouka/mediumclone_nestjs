import { UserEntity } from '@app/users/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentType } from './types/comment.type';
import { ICommentResponse } from './types/commentResponse.interface';
import { ICommentsResponse } from './types/commentsResponse.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly articleService: ArticlesService,
  ) {}

  async getComments(slug: string): Promise<ICommentsResponse> {
    const article = await this.articleService.getBySlug(slug);
    const comments = await this.commentRepository.find({ article });

    return { comments };
  }

  async createComment(
    currentUser: UserEntity,
    slug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentType> {
    const article = await this.articleService.getBySlug(slug);

    const commentData = {
      ...createCommentDto,
      author: currentUser,
      article,
    };

    const comment = new CommentEntity();
    Object.assign(comment, commentData);

    const newComment = await this.commentRepository.save(comment);
    delete newComment.article;

    return newComment;
  }

  async deleteComment(
    commentId: number,
    slug: string,
    userId: number,
  ): Promise<void> {
    const queryBuilder = getRepository(CommentEntity)
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.article', 'article')
      .leftJoinAndSelect('comments.author', 'author')
      .andWhere('comments.id = :commentId', { commentId: commentId })
      .andWhere('article.slug = :slug', {
        slug: slug,
      });

    const comment = await queryBuilder.getOne();

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (comment.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    const res = await this.commentRepository.delete({ id: comment.id });
    console.log(res);
  }

  buildCommentResponse(comment: CommentType): ICommentResponse {
    return { comment };
  }
}
