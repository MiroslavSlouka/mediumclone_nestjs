import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1515769694450 implements MigrationInterface {
  name = 'SeedDb1515769694450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );

    // password: haha
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$dggOlagY6g4nnecWCQ563O0pflSEftsppwy8PAa.PN4fbP.KCPN4.')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'First article description', 'First article body', 'coffee,dragons', 1), ('second-article', 'Second article', 'Second article description', 'Second article body', 'coffee,dragons', 1)`,
    );
  }

  down(): Promise<any> {
    return;
  }
}
