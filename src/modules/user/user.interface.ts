export interface UserData {
  readonly _id: string;
  readonly name: string;
  readonly password: string;
  readonly salt?: string;
}
