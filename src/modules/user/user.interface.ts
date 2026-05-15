import { ClientRole } from 'src/auth/enums/roles.enum';

export interface UserInfo {
  readonly _id: string;
  readonly name: string;
  readonly password: string;
  readonly salt?: string;
  readonly roles: ClientRole;
}
