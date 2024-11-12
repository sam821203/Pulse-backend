/*
 * @description:
 * @param:
 * @return:
 */
/*
 * @description:
 * @param:
 * @return:
 */

/**
 * @Author: hzxOnlineOk
 * @Date: 2024-11-12 17:24:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-11-12 17:59:42
 * @description: 请填写简介
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/interfaces/user.interface';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('USER_MODEL') private readonly userModel: Model<User>,
  ) {}

  /**
   * @description: This function is used to register a new user
   * @param user: User object containing phone and password
   */

  private async register(user: User) {
    return this.userModel
      .find({
        phone: user.phone,
      })
      .then((res) => {
        if (res) {
          console.log('User already exists');
          throw new Error('User already exists');
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
