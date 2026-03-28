import { ICategory } from './category.model';
import { IRUser } from './user.model';

export interface ICoupon {
  id: number;
  code: string;
  amount: number;
  created_at: Date;
  discount_type: IDiscountType;
  description: string;
  date_expires: Date;
  allowed_cat: ICategory[];
  used_by: IRUser[];
  allowed_users: IRUser[];
}

export enum IDiscountType {
  PERCENT = 'percent',
  FIXED_CART = 'fixed_cart',
  FIXED_PRODUCT = 'fixed_product',
  CREDIT = 'credit'
}

export interface CouponValidation {
  valid: boolean;
  coupon: ICoupon;
  credit_products?: number[];
  message?: string;
}
