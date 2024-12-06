import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '../role/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('使用者')
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '使用者註冊' })
  async registerUser(@Body() user: CreateUserDto) {
    return this.userService.register(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: false,
    description: '使用者 ID',
    schema: { default: '67513ead23b91593f61167e8' },
  })
  async getUserInfo(@Param('id') id: string) {
    try {
      const user = await this.userService.findUserById(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...others } = user[0].toJSON();
      return others;
    } catch (error) {
      return { message: error.message };
    }
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
