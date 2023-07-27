import { IUser } from './user.model';

export interface ILoginForm {
  username: string;
  password: string;
}

export type ISignupForm = IUser & ILoginForm & { confirm: string };