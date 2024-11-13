import { Injectable, NestMiddleware } from '@nestjs/common';
import { encript, addSalt } from 'src/utils/encription';

@Injectable()
export class HashPasswordMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    let userPassword = req.body.password;
    if (userPassword) {
      const salt = addSalt();
      userPassword = encript(userPassword, salt);
      // 改為加密後的密碼
      req.body.password = userPassword;
      req.body.salt = salt;
    }
    next();
  }
}
