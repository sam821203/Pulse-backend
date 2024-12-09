import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { USER_MODEL_TOKEN, User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
  EMPTY,
} from 'rxjs';
import { ClientRole } from 'src/auth/enums/roles.enum';

const logger = new Logger('user');

@Injectable()
export class UserService {
  private response: IResponse;
  constructor(
    @InjectModel(USER_MODEL_TOKEN)
    private readonly userModel: Model<UserDocument>,
  ) {}

  register(user: CreateUserDto): Observable<IResponse> {
    return from(this.findUserByName(user.name)).pipe(
      mergeMap((res: User[]) => {
        if (res.length !== 0) {
          this.response = {
            code: 1,
            msg: '當前使用者名稱已註冊',
            data: EMPTY,
          };
          return throwError(() => new Error(this.response.msg as string));
        }
        return of(null);
      }),
      mergeMap(() => {
        const createUser = new this.userModel({
          ...user,
          roles: [ClientRole.User],
        });
        return from(createUser.save()).pipe(
          map(() => {
            this.response = {
              code: 0,
              msg: '註冊成功',
              data: EMPTY,
            };
            return this.response;
          }),
          catchError((error) => {
            this.response = {
              code: 2,
              msg: `使用者註冊失敗，錯誤詳情：${error}，請聯繫相關人員`,
              data: EMPTY,
            };
            return throwError(() => new Error(this.response.msg as string));
          }),
        );
      }),
      catchError((error) => {
        logger.log(`${user.name} ${error.msg}`);
        return of(this.response);
      }),
    );
  }

  async findUserByName(name: string) {
    return await this.userModel.find({ name });
  }

  async findUserById(userId: string) {
    const user = await this.userModel.find({ _id: new Types.ObjectId(userId) });
    if (!user || user.length === 0) {
      logger.log('找不到使用者');
      return null;
    }
    return user;
  }

  async findUser(filter: FilterQuery<UserDocument>) {
    return this.userModel.findOne(filter).exec();
  }

  async findOneAndUpdate(name: string, userData: Partial<User>) {
    return await this.userModel.findOneAndUpdate({ name }, userData, {
      new: true,
    });
  }
}
