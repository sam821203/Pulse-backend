import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { User, UserDocument } from 'src/interfaces/user.interface';

const logger = new Logger('user');

@Injectable()
export class UserService {
  private response: IResponse;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async register(user: User) {
    return this.findOneByPhone(user.phone)
      .then((res: []) => {
        if (res.length !== 0) {
          this.response = {
            code: 1,
            msg: '當前手機號碼已註冊',
          };
          throw this.response;
        }
      })
      .then(async () => {
        try {
          const createUser = new this.userModel(user);
          await createUser.save();
          this.response = {
            code: 0,
            msg: '註冊成功',
          };
          return this.response;
        } catch (error) {
          this.response = {
            code: 2,
            msg: `使用者註冊失敗，錯誤詳情：${error}，請聯繫相關人員`,
          };
          throw this.response;
        }
      })
      .catch((error) => {
        logger.log(`${user.phone} ${error.msg}`);
        return this.response;
      });
  }

  async findOneByPhone(phone: string) {
    return await this.userModel.find({ phone });
  }

  async findOneAndUpdate(phone: string, userData: Partial<User>) {
    return await this.userModel.findOneAndUpdate({ phone }, userData, {
      new: true,
    });
  }
}
