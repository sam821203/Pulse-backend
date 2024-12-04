import { randomBytes, pbkdf2Sync } from 'crypto';

export class CommonUtility {
  public static addSalt(): string {
    return randomBytes(3).toString('base64');
  }

  public static encryptBySalt(
    input: string,
    salt: string = CommonUtility.addSalt(),
  ): any {
    const hash = pbkdf2Sync(input, salt, 10000, 16, 'sha256').toString(
      'base64',
    );
    return { hash, salt };
  }
}
