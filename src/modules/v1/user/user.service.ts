import { QueryFilter } from '@nestjsx/crud-request';
import { User } from './../../../entities/user.entity';
import { CreateUserResponse } from './responses/create-user.response';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { BaseService } from '#modules/base/service.base';
import { InjectRepository } from '@nestjs/typeorm';
import { mapOperatorsToQuery } from '#utils/stadardizer';

@Injectable()
export class UserService extends BaseService(User) {
  constructor(
    @InjectRepository(User)
    readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async getUsers(
    filters: QueryFilter[],
    order: { [field: string]: 'ASC' | 'DESC' },
    take: number,
    skip: number,
  ): Promise<[User[], number]> {
    const alias = 'users';
    const qb = this.userRepo.createQueryBuilder(alias);

    if (filters) {
      for (const filter of filters) {
        if (['email', 'full_name', 'role'].includes(filter.field)) {
          const { str, params } = mapOperatorsToQuery(alias, filter, filter.value);
          qb.andWhere(str, params);
        }
      }
    }

    if (order) {
      for (const [field, direction] of Object.entries(order)) {
        qb.addOrderBy(`${alias}.${field}`, direction, 'NULLS LAST');
      }
    } else {
      qb.addOrderBy(`${alias}.created_at`, 'DESC', 'NULLS LAST');
    }

    if (take) qb.take(take);

    if (skip) qb.skip(skip);

    return qb.getManyAndCount();
  }

  async createUser(dto: CreateUserDto): Promise<CreateUserResponse> {
    const { email } = dto;
    if (await this.exists({ email })) {
      throw new BadRequestException('This email address has already been registered.');
    }
    const user = await this.create({ ...dto });
    return { id: user.id };
  }
}
