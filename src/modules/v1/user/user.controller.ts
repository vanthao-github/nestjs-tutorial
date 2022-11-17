import { CreateUserDto } from './dtos/create-user.dto';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserResponse } from './responses/create-user.response';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUser(): string {
    return this.userService.getUsers();
  }

  @Post()
  @ApiOkResponse({ type: CreateUserResponse })
  @ApiOperation({ summary: 'Create User' })
  @ApiBadRequestResponse({ description: 'Invalid params' })
  async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.createUser(dto);
  }
}
