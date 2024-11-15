import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/interfaces/user.interface';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('使用者登入相關')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '使用者登入' })
  public async userLogin(@Body() userDto: User) {
    return await this.authService.login(userDto);
  }

  @Post('alter')
  @ApiOperation({ summary: '使用者修改密碼' })
  public async alterUser(@Body() userDto: User) {
    return await this.authService.alter(userDto);
  }
}
