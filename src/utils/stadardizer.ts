import { ObjectLiteral } from 'typeorm';
import { GetManyResponse, Metadata } from './types';
import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { QuerySort, QueryFilter, ComparisonOperator } from '@nestjsx/crud-request';

export function StandardizedList<T>(type: Type<T>): Type<GetManyResponse<T>> {
  class Response<D> implements GetManyResponse<D> {
    @ApiProperty({ type, isArray: true })
    data!: D[];

    @ApiProperty()
    metadata!: Metadata;
  }

  Object.defineProperty(Response, 'name', {
    value: `${type.name}List`,
  });

  return Response;
}

export const sortToTypeOrmOrder = (sort: QuerySort[]): Record<string, 'ASC' | 'DESC'> => {
  return sort.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.field]: currentValue.order,
    };
  }, {});
};

export const mapOperatorsToQuery = (
  alias: string,
  cond: QueryFilter,
  param: any,
): { str: string; params: ObjectLiteral } => {
  const field = cond.field.includes('.')
    ? cond.field
    : `"${alias}".${cond.field.includes('::') ? cond.field : `"${cond.field}"`}`;

  const likeOperator = 'ILIKE';
  let str: string;
  let params: ObjectLiteral | undefined;

  if (cond.operator[0] !== '$') {
    cond.operator = ('$' + cond.operator) as ComparisonOperator;
  }

  switch (cond.operator) {
    case '$eq':
      str = `${field} = :${param}`;
      break;

    case '$ne':
      str = `${field} != :${param}`;
      break;

    case '$gt':
      str = `${field} > :${param}`;
      break;

    case '$lt':
      str = `${field} < :${param}`;
      break;

    case '$gte':
      str = `${field} >= :${param}`;
      break;

    case '$lte':
      str = `${field} <= :${param}`;
      break;

    case '$starts':
      str = `LOWER(${field}) LIKE LOWER(:${param})`;
      params = { [param]: `%${cond.value}` };
      break;

    case '$ends':
      str = `LOWER(${field}) LIKE LOWER(:${param})`;
      params = { [param]: `%${cond.value}` };
      break;

    case '$cont':
      str = `LOWER(${field}) LIKE LOWER(:${param})`;
      params = { [param]: `%${cond.value}` };
      break;

    case '$contL':
      str = `LOWER(${field}) ${likeOperator} :${param}`;
      params = { [param]: `%${cond.value}` };
      break;

    default:
      str = `${field} = :${param}`;
      break;
  }

  if (typeof params === 'undefined') {
    params = { [param]: cond.value };
  }

  return { str, params };
};
