import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger('ItemsService');

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const item = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save(item);
  }

  async findAll(idUser: string): Promise<Item[]> {
    return this.itemsRepository.find({
      where: { user: { id: idUser } },
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id: id,
      user: {
        id: user.id,
      },
    });
    if (!item) throw new NotFoundException(`Item con ${id} no encontrado.`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item con ${id} no encontrado.`);
    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);
    return { ...item, id };
  }

  private handleDBException(error: any) {
    this.logger.error(error.detail);
    switch (error.code) {
      case '23505':
        throw new BadRequestException(error.detail);
      default:
        throw new InternalServerErrorException('Error al crear el item');
    }
  }
}
