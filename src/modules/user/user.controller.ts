import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../role/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('使用者')
// @ApiBearerAuth('jwt')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '使用者註冊' })
  async registerUser(@Body() user: CreateUserDto) {
    return this.userService.register(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserInfo(@Param('id') id: string) {
    const user = await this.userService.findUser({ _id: id });
    const { password, ...others } = user[0].toJSON();
    console.log('password', password);
    return others;
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
