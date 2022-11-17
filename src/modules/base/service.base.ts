import { Injectable, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFilter } from '@nestjsx/crud-request';
import { DeepPartial, EntityManager, FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseService<T> {
  findManyAndCount(
    filters?: QueryFilter[],
    order?: { [field: string]: 'ASC' | 'DESC' },
    take?: number,
    skip?: number,
  ): Promise<[T[], number]>;
  create(dto: DeepPartial<T>, manager?: EntityManager): Promise<T>;
  update(conditions: FindConditions<T>, dto: QueryDeepPartialEntity<T>, manager?: EntityManager): Promise<void>;
  delete(conditions: FindConditions<T>, manager?: EntityManager): Promise<void>;
  exists(conditions: FindConditions<T>, manager?: EntityManager): Promise<boolean>;
  count(conditions: FindConditions<T>, manager?: EntityManager): Promise<number>;
}

type Constructor<I> = new (...args: any[]) => I;

export function BaseService<T>(entity: Constructor<T>): Type<IBaseService<T>> {
  @Injectable()
  class BaseServiceHost implements IBaseService<T> {
    constructor(@InjectRepository(entity) private readonly repository: Repository<T>) {}

    async findManyAndCount(
      filters?: QueryFilter[],
      order?: { [field: string]: 'ASC' | 'DESC' },
      take?: number,
      skip?: number,
    ): Promise<[T[], number]> {
      console.log('filters', filters);
      console.log('order', order);
      console.log('take', take);
      console.log('skip', skip);

      const alias = this.repository.metadata.tableName;
      const qb = this.repository.createQueryBuilder(alias);

      return await qb.getManyAndCount();
    }

    async create(dto: DeepPartial<T>, manager?: EntityManager): Promise<T> {
      if (manager) {
        return await manager.save(entity, manager.create(entity, dto));
      } else {
        return await this.repository.save(this.repository.create(dto));
      }
    }

    async update(
      conditions: FindConditions<T>,
      dto: QueryDeepPartialEntity<T>,
      manager?: EntityManager,
    ): Promise<void> {
      if (manager) {
        await manager.update(entity, conditions, dto);
      } else {
        await this.repository.update(conditions, dto);
      }
    }

    async delete(conditions: FindConditions<T>, manager?: EntityManager): Promise<void> {
      if (manager) {
        await manager.delete(entity, conditions);
      } else {
        await this.repository.delete(conditions);
      }
    }

    async exists(conditions: FindConditions<T>, manager?: EntityManager): Promise<boolean> {
      if (manager) {
        return Boolean(await manager.count(entity, conditions));
      } else {
        return Boolean(await this.repository.count(conditions));
      }
    }

    async count(conditions: FindConditions<T>, manager?: EntityManager): Promise<number> {
      if (manager) {
        return await manager.count(entity, conditions);
      } else {
        return await this.repository.count(conditions);
      }
    }
  }
  return BaseServiceHost;
}
