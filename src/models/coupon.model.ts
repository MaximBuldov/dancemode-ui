import { Categories } from './product.model';

export interface ICoupon {
  id: number;
  code: string;
  amount: string;
  date_created: string;
  discount_type: IDiscountType;
  description: string;
  date_expires: string;
  usage_count: number;
  individual_use: boolean;
  product_ids: number[];
  excluded_product_ids: number[];
  usage_limit: number;
  usage_limit_per_user: number;
  limit_usage_to_x_items: number;
  product_categories: number[];
  exc_cat: Categories[];
  email_restrictions: string[];
  used_by: number[];
  allowed_users: number[];
}

export enum IDiscountType {
  PERCENT = 'percent',
  FIXED_CART = 'fixed_cart',
  FIXED_PRODUCT = 'fixed_product'
}
