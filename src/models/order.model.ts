export interface IOrder {
  customer_id: number;
  line_items: IOrderProduct[];
  meta_data?: IMetaData[];
  payment_method?: IPaymentMethod;
  coupon_lines?: { code: string; discount?: string }[];
  billing?: IBilling;
  shipping?: IBilling;
  status: IOrderStatus;
}

export interface IROrder extends IOrder {
  id: number;
  customer_name: string;
  date: string;
  date_created: string;
  total: number;
  line_items: IROrderProduct[];
  note?: string;
  group: string;
}

export interface IOrderProduct {
  product_id: number;
  subtotal: number;
  total: number;
  meta_data?: IMetaData[];
}

export interface IROrderProduct extends IOrderProduct {
  id: number;
  name: string;
  order: number;
  date_time: string;
}

export interface IMetaData {
  id?: number;
  key: string;
  value: string;
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
