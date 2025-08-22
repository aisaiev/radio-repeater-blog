import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/app-config.consts';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FilesService {
  private readonly audioDirectory: string;

  constructor(private readonly configService: ConfigService) {
    this.audioDirectory = this.configService.getOrThrow(
      EnvironmentVariables.AUDIO_FILES_DIR,
    );
  }

  async saveAudioFile(file: Express.Multer.File): Promise<void> {
    const filePath = path.join(this.audioDirectory, file.originalname);
    await fs.writeFile(filePath, file.buffer);
  }
}
