import {
  Controller,
  Post,
  UploadedFile,
  Headers,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { EnvironmentVariables } from 'src/config/app-config.consts';
import { FilesService } from '../service/files.service';

@Controller('files')
export class FilesController {
  private readonly trustedApiKey: string;

  constructor(
    private readonly filesSerive: FilesService,
    private readonly configService: ConfigService,
  ) {
    this.trustedApiKey = this.configService.getOrThrow(
      EnvironmentVariables.API_KEY,
    );
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Headers('x-api-key') apiKey: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'audio/mpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (apiKey !== this.trustedApiKey) {
      throw new Error('Invalid API key');
    }
    return this.filesSerive.saveAudioFile(file);
  }
}
