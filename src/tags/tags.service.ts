import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagRepository.find();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
