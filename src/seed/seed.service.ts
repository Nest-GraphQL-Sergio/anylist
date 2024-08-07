import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new UnauthorizedException('Seed cannot be executed on PRD');

    // TODO: Limpiar la base de datos

    // TODO: Crear usuarios

    // TODO: Crear items
    return true;
  }
}
