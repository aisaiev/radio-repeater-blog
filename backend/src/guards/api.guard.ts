import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/app-config.consts';

@Injectable()
export class ApiGuard implements CanActivate {
  private readonly trustedApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.trustedApiKey = this.configService.getOrThrow(
      EnvironmentVariables.API_KEY,
    );
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['x-api-key'] as string | undefined;

    if (authHeader !== this.trustedApiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}
