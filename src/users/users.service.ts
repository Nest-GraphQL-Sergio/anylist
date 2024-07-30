import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepositoty: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepositoty.create(signupInput);
      return await this.usersRepositoty.save(newUser);
    } catch (error) {
      throw new BadRequestException('Algo salio mal');
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error(' findOne Not implemented');
  }

  async block(id: string): Promise<User> {
    throw new Error('block Not implemented');
  }
}
