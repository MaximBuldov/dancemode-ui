import { ICategory } from './category.model';
import { IROrderProduct } from './order.model';

export interface IProduct {
  id: number;
  name: string;
  sale_price: null | number;
  price: number;
  date_time: Date;
  is_canceled: boolean;
  categories: ICategory[];
  stock_quantity: number;
  wait_list: number[];
  orders?: IROrderProduct[];
  total?: number;
}

export type ICreateProduct = Partial<
  Omit<IProduct, 'categories'> & {
    categories: number[];
  }
>;

export interface ICartProduct extends IProduct {
  day: string;
  month: string;
}

export interface IBatchProducts {
  create?: IProduct[];
  update?: IProduct[];
  delete?: number[];
}

export const CLASS_TIME_FORMAT = 'h:mma';
