import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * @description:
   * @param user: User object containing name, phone and password
   * @return:
   */
  async register(user: User) {
    return this.userModel
      .find({
        phone: user.phone,
      })
      .then((res) => {
        if (res.length !== 0) {
          console.log('使用者已存在');
          throw new Error('使用者已存在');
        }
      })
      .then(() => {
        try {
          const createUser = new this.userModel(user);
          return createUser.save();
        } catch (error) {
          throw new Error(error);
        }
      })
      .catch((error) => {
        console.warn('異常問題', error);
      });
  }
}
