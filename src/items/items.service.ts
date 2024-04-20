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

@Injectable()
export class ItemsService {
  private readonly logger = new Logger('ItemsService');

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    try {
      const item = this.itemsRepository.create(createItemInput);
      return await this.itemsRepository.save(item);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });

    if (!item) throw new NotFoundException(`Item con ${id} no encontrado.`);

    return item;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
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
