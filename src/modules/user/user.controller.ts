import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/interfaces/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Role } from '../role/role.decorator';

@Controller('user')
@ApiTags('使用者')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '使用者進行註冊' })
  async registerUser(@Body() userDto: User) {
    return this.userService.register(userDto);
  }

  @Get('hello')
  @Role('admin')
  hello() {
    return 'hello world!';
  }
}
