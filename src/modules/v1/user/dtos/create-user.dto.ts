import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'theo@yopmail.com' })
  @Transform(({ value }) => value.toLowerCase())
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Theo Nguyen' })
  readonly full_name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123123aA1#' })
  readonly password?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Admin' })
  @Transform(({ value }) => value.toLowerCase())
  readonly role?: string;
}
