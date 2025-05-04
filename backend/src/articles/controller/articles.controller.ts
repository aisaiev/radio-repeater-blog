import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ArticlesService } from '../service/articles.service';
import { CreateArticleRequest } from '../dto/create-article.request';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/app-config.consts';

@Controller('articles')
export class ArticlesController {
  private readonly trustedApiKey: string;

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly configService: ConfigService,
  ) {
    this.trustedApiKey = this.configService.getOrThrow(
      EnvironmentVariables.API_KEY,
    );
  }

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
  async createArticle(
    @Headers('x-api-key') apiKey: string,
    @Body() article: CreateArticleRequest,
  ) {
    if (apiKey !== this.trustedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    await this.articlesService.createArticle(article);
  }
}
