import { User, UserRole } from './../../../entities/user.entity';
import { CreateUserResponse } from './responses/create-user.response';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { BaseService } from '#modules/base/service.base';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService extends BaseService(User) {
  constructor(
    @InjectRepository(User)
    readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  getUsers(): string {
    return 'Hello! this is get users list';
  }

  async createUser(dto: CreateUserDto): Promise<CreateUserResponse> {
    const { email } = dto;

    if (await this.exists({ email })) {
      throw new BadRequestException('This email address has already been registered.');
    }

    return this.create({ ...dto });
  }
}
