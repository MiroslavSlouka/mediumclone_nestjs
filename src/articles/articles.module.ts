import { FollowEntity } from '@app/profiles/follow.entity';
import { UserEntity } from '@app/users/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CommentEntity } from './comment.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      FollowEntity,
      CommentEntity,
    ]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, CommentsService],
})
export class ArticlesModule {}
