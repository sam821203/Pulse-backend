import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
} from 'rxjs';

const logger = new Logger('user');

@Injectable()
export class UserService {
  private response: IResponse;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  register(user: CreateUserDto): Observable<IResponse> {
    return from(this.findOneByPhone(user.phone)).pipe(
      mergeMap((res: User[]) => {
        if (res.length !== 0) {
          this.response = {
            code: 1,
            data: '當前手機號碼已註冊',
          };
          return throwError(() => new Error(this.response.data as string));
        }
        return of(null);
      }),
      mergeMap(() => {
        const createUser = new this.userModel(user);
        return from(createUser.save()).pipe(
          map(() => {
            this.response = {
              code: 0,
              data: '註冊成功',
            };
            return this.response;
          }),
          catchError((error) => {
            this.response = {
              code: 2,
              data: `使用者註冊失敗，錯誤詳情：${error}，請聯繫相關人員`,
            };
            return throwError(() => new Error(this.response.data as string));
          }),
        );
      }),
      catchError((error) => {
        logger.log(`${user.phone} ${error.msg}`);
        return of(this.response);
      }),
    );
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
