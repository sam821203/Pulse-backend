import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('使用者登入相關')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '使用者登入' })
  public async userLogin(@Body() user: LoginUserDto) {
    return await this.authService.login(user);
  }

  // @Post('alter')
  // @ApiOperation({ summary: '使用者修改密碼' })
  // public async alterUser(@Body() user: AlterUserDto) {
  //   return await this.authService.alter(user);
  // }
}
