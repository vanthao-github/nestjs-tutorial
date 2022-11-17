import { GetManyResponse, Metadata } from './types';
import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
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
