import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new UnauthorizedException('Seed cannot be executed on PRD');

    await this.deleteDatabase();
    const user = await this.loadUsers();

    // TODO: Crear items
    return true;
  }

  async deleteDatabase(): Promise<void> {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }
}
