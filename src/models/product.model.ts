export interface IProduct {
  id: number;
  name: NameOfClass;
  price: string;
  time: string;
  date_time: string;
  total?: string;
}

export interface ICartProduct extends IProduct {
  day: string;
  month: string;
  total?: string;
}

export interface ICreateProduct {
  name: NameOfClass;
  time: number;
  price: string;
}

export enum NameOfClass {
  BEGINNER = 'Beginner',
  ADV = 'Int/Adv'
}