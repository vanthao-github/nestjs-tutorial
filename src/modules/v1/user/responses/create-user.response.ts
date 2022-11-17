import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty({ example: '12312a1-123-123213' })
  readonly id!: string;
}
