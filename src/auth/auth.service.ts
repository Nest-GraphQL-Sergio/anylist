import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Credentials not valid');

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user.isActive)
      throw new UnauthorizedException('User not active. Talk with and admin.');

    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }

  private getJwtToken(userId: string): string {
    return this.jwtService.sign({
      id: userId,
    });
  }
}
