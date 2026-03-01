import { IROrderProduct } from './order.model';

export interface IProduct {
  id: number;
  name: string | NameOfClass;
  sale_price: null | number;
  price: number;
  date_time: Date;
  is_canceled: boolean;
  category_id: Categories;
  stock_quantity: number;
  wait_list: number[];
  orders?: IROrderProduct[];
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

export const CatMap = {
  [Categories.BEGINNER]: NameOfClass.BEGINNER,
  [Categories.ADV]: NameOfClass.ADV,
  [Categories.CUSTOM]: NameOfClass.CUSTOM
};
export const catOptions = [
  { label: NameOfClass.BEGINNER, value: Categories.BEGINNER },
  { label: NameOfClass.ADV, value: Categories.ADV },
  { label: NameOfClass.CUSTOM, value: Categories.CUSTOM }
];
