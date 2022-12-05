import { Swagger } from '@nestjsx/crud/lib/crud';
import { DEFAULT_LIMIT } from './../../../constants/app';
import { GetManyResponse } from './../../../utils/types';
import { CreateUserDto } from './dtos/create-user.dto';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserResponse } from './responses/create-user.response';
import { UserService } from './user.service';
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';
import { sortToTypeOrmOrder, StandardizedList } from '#utils/stadardizer';
import { GetUserResponse } from './responses/get-user.response';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {
    // const metadata = Swagger.getParams(this.getUsers);
    // console.log('metadata', metadata);
  }

  @Get()
  @UseInterceptors(CrudRequestInterceptor)
  @ApiOperation({ summary: 'List of Users' })
  @ApiOkResponse({ type: StandardizedList(GetUserResponse) })
  async getUsers(@ParsedRequest() req: CrudRequest): Promise<GetManyResponse<any>> {
    const { filter, sort, limit = DEFAULT_LIMIT, offset } = req.parsed;
    const order = sortToTypeOrmOrder(sort);
    const [data, total] = await this.userService.getUsers(filter, order, limit, offset);
    return { data, metadata: { total } };
  }

  @Post()
  @ApiOkResponse({ type: CreateUserResponse })
  @ApiOperation({ summary: 'Create User' })
  @ApiBadRequestResponse({ description: 'Invalid params' })
  async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.createUser(dto);
  }
}
