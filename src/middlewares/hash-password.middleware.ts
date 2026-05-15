import { Injectable, NestMiddleware } from '@nestjs/common';
import { CommonUtility } from 'src/utils/common.utility';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const userPassword = req.body.password;
    if (userPassword) {
      const { hash, salt } = CommonUtility.encryptBySalt(userPassword);
      // 改為加密後的密碼
      req.body.password = hash;
      req.body.salt = salt;
    }
    next();
  }
}
