import { ICoupon } from './coupon.model';
import { IProduct } from './product.model';
import { ITemplate } from './template.model';

export interface ICategory {
  id: number;
  created_at?: string;
  name: string;
  products?: IProduct[];
  templates?: ITemplate[];
  coupons?: ICoupon[];
}
