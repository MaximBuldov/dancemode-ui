import { ICategory } from './category.model';
import { IROrderProduct } from './order.model';

export interface IProduct {
  id: number;
  name: string | NameOfClass;
  price: number;
  date_time: Date;
  is_canceled: boolean;
  category: ICategory;
  category_id: Categories;
  stock_quantity: number;
  wait_list: number[];
  orders: IROrderProduct[];
  total?: number;
}

export interface ICartProduct extends IProduct {
  day: string;
  month: string;
}

export interface ICreateProduct {
  name: NameOfClass;
  time: number;
  price: string;
}

export interface IBatchProducts {
  create?: IProduct[];
  update?: IProduct[];
  delete?: number[];
}

export enum NameOfClass {
  BEGINNER = 'Beginner',
  ADV = 'Int/Adv',
  CUSTOM = 'Custom'
}

export enum Categories {
  BEGINNER = 1,
  ADV = 2,
  CUSTOM = 3
}

export const catOptions = [
  { label: NameOfClass.BEGINNER, value: Categories.BEGINNER },
  { label: NameOfClass.ADV, value: Categories.ADV },
  { label: NameOfClass.CUSTOM, value: Categories.CUSTOM }
];
