import dayjs from 'dayjs';

import { IUser } from './user.model';

export interface ILoginForm {
  username: string;
  password: string;
}

export type ISignupForm = IUser & ILoginForm & { confirm: string };

export interface ICreateProductsForm {
  startMonth: string;
  endMonth: string;
  classes: ICategoryOption[];
}

export interface ICreateSingleProductsForm {
  date_time?: dayjs.Dayjs | string,
  name?: string,
  regular_price?: string,
  category?: ICategoryOption,
  categories?: { id?: number }[]
}

export interface ICategoryOption {
  label: string,
  value: number
}
