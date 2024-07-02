import { IProduct } from './product.model';
import { IRUser, IUser } from './user.model';

export interface IOrder {
  line_items: IOrderProduct[];
  payment_method?: IPaymentMethod;
  coupons?: { code: string; discount?: string }[];
  status: IOrderStatus;
  stripe_id?: string;
}

export interface IROrder extends IOrder {
  id: number;
  customer_id: number;
  customer: Pick<IUser, 'first_name' | 'last_name'>;
  created_at: string;
  total: number;
  line_items: IROrderProduct[];
  note?: string;
  group: string;
}

export interface IOrderProduct {
  product_id: number;
  subtotal: number;
  total: number;
  productStatus?: IProductStatus;
}

export interface IROrderProduct extends IOrderProduct {
  id: number;
  name: string;
  order_id: number;
  order: Pick<IROrder, 'status'>;
  product_id: number;
  product: Pick<IProduct, 'name'>;
  user_id: number;
  user: Pick<IRUser, 'first_name' | 'last_name'>;
}

export interface IMetaData {
  id?: number;
  key: string;
  value: string;
}

export enum IProductStatus {
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  WAIT_LIST = 'wait_list'
}

export enum IStatus {
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  WAIT_LIST = 'wait_list'
}

export enum IOrderStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing'
}

export enum IStatusValue {
  TRUE = '1',
  FALSE = '0'
}

export interface IPaymentIntent {
  paymentIntentId: string;
  clientSecret: string;
}

export interface IStripeResponse {
  intent: IPaymentIntent;
  order_id: number;
}

export enum IPaymentMethod {
  CASH = 'cash',
  STRIPE = 'stripe',
  COUPON = 'coupon'
}

interface IBilling {
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  country?: string;
}
