import { Body, Controller, Get, Post } from '@nestjs/common';
// import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../role/role.decorator';
// import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('使用者')
// @UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '使用者註冊' })
  async registerUser(@Body() user: CreateUserDto) {
    return this.userService.register(user);
  }

  @Get('hello')
  @Role('admin')
  hello() {
    return {
      code: 0,
      msg: 'hello world!',
    };
  }
}
