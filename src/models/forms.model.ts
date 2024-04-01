import { Dayjs } from 'dayjs';

import { IUser } from './user.model';

export interface ILoginForm {
  username: string;
  password: string;
}

export type ISignupForm = IUser & ILoginForm & { confirm: string };

export interface ICreateProductsForm {
  dates: Dayjs[];
  classes: ICategoryOption[];
}

export interface ICreateSingleProductsForm {
  date_time?: Dayjs | string,
  name?: string,
  regular_price?: string,
  category?: ICategoryOption,
  categories?: { id?: number }[],
  stock_quantity?: number
}

export interface ICategoryOption {
  label: string,
  value: number
}
