import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from '../service/articles.service';
import { CreateArticleRequest } from '../dto/create-article.request';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { ApiGuard } from 'src/guards/api.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getArticles(@Query() data: PaginationRequestDto) {
    return this.articlesService.getArticles(data);
  }

  @Get(':id')
  async getArticle(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articlesService.getArticle(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  @Post()
  @UseGuards(ApiGuard)
  async createArticle(@Body() article: CreateArticleRequest) {
    await this.articlesService.createArticle(article);
  }
}
