export interface IProduct {
  id: number;
  name: NameOfClass;
  price: string;
  time: string;
  date_time: string;
  total?: string;
  is_canceled: boolean;
  total_sales: number;
  stock_status: IStockStatus;
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

export interface IBatchProducts {
  create?: IProduct[],
  update?: IProduct[],
  delete?: number[]
}

export enum NameOfClass {
  BEGINNER = 'Beginner',
  ADV = 'Int/Adv'
}

export enum IStockStatus {
  INSTOCK = 'instock',
  OUTOFSTOCK = 'outofstock',
  ONBACKORDER = 'onbackorder'
}