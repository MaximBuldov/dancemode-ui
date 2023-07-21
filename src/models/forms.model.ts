import { IUser } from './user.model';

export interface ILoginForm {
  username: string;
  password: string;
}

export type ISignupForm = IUser & ILoginForm & { confirm: string };

export interface IUpdateUser extends ISignupForm {
  acf: {
    instagram: string;
    billing_phone: string;
  }
}