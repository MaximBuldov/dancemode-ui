export interface IProduct {
  id: number;
  name: string;
  price: string;
  time: string;
}

export interface ICartProduct extends IProduct {
  day: string;
  month: string;
  total?: string;
}