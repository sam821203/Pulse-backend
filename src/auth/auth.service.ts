import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/interfaces/response.interface';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { UserService } from 'src/modules/user/user.service';
import { encript } from 'src/utils/encription';
import { User } from 'src/modules/user/schema/user.schema';

const logger = new Logger('auth.service');

@Injectable()
export class AuthService {
  private response: IResponse;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(user: { phone: string; password: string }) {
    const phone: string = user.phone;
    const password: string = user.password;
    return await this.userService
      .findOneByPhone(phone)
      .then((res) => {
        if (res.length === 0) {
          this.response = {
            code: 3,
            msg: '使用者尚未註冊',
          };
          throw this.response;
        }
        return res[0];
      })
      .then((dbUser: User) => {
        const pass = encript(password, dbUser.salt);
        // 加密密碼，如果等於使用者保存在數據庫的密碼，則登錄成功
        if (pass === dbUser.password) {
          this.response = {
            code: 0,
            msg: { userId: dbUser._id },
          };
          return this.response;
        } else {
          this.response = {
            code: 2,
            msg: '登入失敗，密碼錯誤',
          };
          return this.response;
        }
      })
      .catch((err) => {
        return err;
      });
  }

  async createToken(user: LoginUserDto) {
    return this.jwtService.sign(user);
  }

  // 忘記密碼 / 主動修改密碼
  public async alter(user: User) {
    return this.userService
      .findOneByPhone(user.phone)
      .then(async () => {
        return await this.userService.findOneAndUpdate(user.phone, user);
      })
      .then(() => {
        logger.log(`使用者${user.phone}修改密碼成功!`);
        return (this.response = {
          code: 0,
          msg: '修改密碼成功',
        });
      });
  }

  public async login(user: LoginUserDto) {
    return await this.validateUser(user)
      .then(async (res) => {
        if (res.code !== 0) {
          this.response = res;
          throw this.response;
        }
        this.response = {
          code: 0,
          msg: {
            userId: res.msg.userId,
            token: await this.createToken(user),
          },
        };
        return this.response;
      })
      .catch((err) => {
        return err;
      });
  }
}
