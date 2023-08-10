import dayjs from 'dayjs';

import { IUser } from './user.model';
import { NameOfClass } from './product.model';

export interface ILoginForm {
  username: string;
  password: string;
}

export type ISignupForm = IUser & ILoginForm & { confirm: string };

export interface ICreateProductsForm {
  months: dayjs.Dayjs[];
  classes: NameOfClass[];
}

export interface ICreateSingleProductsForm {
  date_time: dayjs.Dayjs,
  name: string,
  regular_price: number,
}