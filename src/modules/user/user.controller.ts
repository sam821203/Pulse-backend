import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/interfaces/user.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../role/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('使用者')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '使用者註冊' })
  async registerUser(@Body() userDto: User) {
    return this.userService.register(userDto);
  }

  @Get('hello')
  @Role('admin')
  hello() {
    return 'hello world!';
  }
}
