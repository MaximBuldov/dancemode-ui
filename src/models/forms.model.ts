import { Dayjs } from 'dayjs';

import { IUser } from './user.model';

export interface ILoginForm {
  email: string;
  password: string;
}

export type ISignupForm = IUser & ILoginForm & { confirm: string };

export interface ICreateProductsForm {
  dates: Dayjs[];
  classes: ICategoryOption[];
  name?: string;
  regular_price?: string;
  stock_quantity?: string;
  time?: string;
}
export interface ICategoryOption {
  label: string;
  value: number;
}
