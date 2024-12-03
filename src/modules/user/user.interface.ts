export interface UserData {
  readonly _id: string;
  readonly phone: string;
  readonly password: string;
  readonly salt?: string;
}
