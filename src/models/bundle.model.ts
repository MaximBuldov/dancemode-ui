import { IProduct } from './product.model';

export interface IBundle {
  id: number;
  created_at: string;
  discount: number;
  products: IProduct[];
}

export interface IBundleUpdate {
  id: number;
  discount?: number;
  products?: number[];
}
