import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtBlacklistGuard } from '../auth/guards/jwt-blacklist.guard';

@Controller('auth')
@ApiTags('使用者登入相關')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: '使用者登入' })
  public async userLogin(@Body() user: LoginUserDto) {
    return await this.authService.login(user);
  }

  @UseGuards(JwtBlacklistGuard)
  @Post('logout')
  @ApiOperation({ summary: '使用者登出' })
  async userLogout(@Body('token') token: string) {
    return await this.authService.logout(token);
  }

  // @Post('alter')
  // @ApiOperation({ summary: '使用者修改密碼' })
  // public async alterUser(@Body() user: AlterUserDto) {
  //   return await this.authService.alter(user);
  // }
}
