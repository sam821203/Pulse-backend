import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'name', passwordField: 'password' });
  }

  async validate(name: string, password: string) {
    const user = await this.authService.validateUser({ name, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
