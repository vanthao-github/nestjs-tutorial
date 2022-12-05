import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
})
export class ModuleV1 {}
