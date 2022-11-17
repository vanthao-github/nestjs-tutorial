import { User } from './../../../entities/user.entity';
import { OmitType } from '@nestjs/swagger';

export class UserRequest extends OmitType(User, ['hashPassword'] as const) {}

export interface DecodedJwtRequest {
  user: UserRequest;
}
