import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor() {}

  async executeSeed(): Promise<boolean> {
    // TODO: Limpiar la base de datos

    // TODO: Crear usuarios

    // TODO: Crear items
    return true;
  }
}
