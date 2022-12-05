import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponse {
  @ApiProperty({ example: '4341343-431-4114313-41431' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  full_name!: string;

  @ApiProperty()
  role!: string;
}
