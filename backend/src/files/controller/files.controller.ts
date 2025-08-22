import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../service/files.service';
import { ApiGuard } from 'src/guards/api.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(ApiGuard)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'audio/mpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.filesService.saveAudioFile(file);
  }
}
