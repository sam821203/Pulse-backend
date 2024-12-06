import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/interfaces/response.interface';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/schema/user.schema';
import { CommonUtility } from 'src/utils/common.utility';
import { EMPTY } from 'rxjs';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';

const logger = new Logger('auth.service');

@Injectable()
export class AuthService {
  private response: IResponse;
  // 儲存無效的 JWT
  private blacklist: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser({
    name,
    password,
  }: {
    name: string;
    password: string;
  }): Promise<IResponse> {
    try {
      const res = await this.userService.findUserByName(name);
      if (res.length === 0) {
        this.response = {
          code: 3,
          msg: '使用者尚未註冊',
          data: EMPTY,
        };
        throw this.response;
      }

      const dbUser = res[0];
      const { hash } = CommonUtility.encryptBySalt(password, dbUser.salt);
      // 加密密碼，如果等於使用者保存在數據庫的密碼，則登錄成功
      if (hash === dbUser.password) {
        this.response = {
          code: 0,
          msg: '驗證成功',
          data: { userId: dbUser._id },
        };
      } else {
        this.response = {
          code: 2,
          msg: '登入失敗，密碼錯誤',
          data: EMPTY,
        };
      }
      return this.response;
    } catch (err) {
      logger.error(`驗證失敗: ${err.msg || err.message}`);
      return err;
    }
  }

  async generateJwt(user: LoginUserDto) {
    return this.jwtService.sign(user);
  }

  // 忘記密碼 / 主動修改密碼
  public async alter(user: User) {
    try {
      await this.userService.findUserByName(user.name);
      await this.userService.findOneAndUpdate(user.name, user);
      logger.log(`使用者${user.name}修改密碼成功!`);
      this.response = {
        code: 0,
        msg: '修改密碼成功',
        data: EMPTY,
      };
      return this.response;
    } catch (error) {
      logger.error(`使用者${user.name}修改密碼失敗: ${error.message}`);
      throw error;
    }
  }

  async login(user: LoginUserDto) {
    try {
      const res = await this.validateUser(user);
      if (res.code !== 0) {
        this.response = res;
        throw this.response;
      }
      this.response = {
        code: 0,
        msg: '登入成功',
        data: {
          userId: (res.data as { userId: string }).userId,
          token: await this.generateJwt(user),
        },
      };
      return this.response;
    } catch (err) {
      logger.error(`登入失敗: ${err.msg || err.message}`);
      return err;
    }
  }

  async logout(token: string) {
    // 將 JWT 添加到黑名單
    this.blacklist.add(token);
    return {
      code: 0,
      msg: '登出成功',
      data: EMPTY,
    };
  }
}
