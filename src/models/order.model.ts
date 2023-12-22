export interface IOrder {
  customer_id: number;
  line_items: IOrderProduct[];
  meta_data?: IMetaData[];
}

export interface IROrder extends IOrder {
  id: number;
  customer_name: string;
  status: string;
  date: string;
  total: string;
  line_items: IROrderProduct[];
}

export interface IOrderProduct {
  product_id: number;
  subtotal: string;
  total: string;
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
  CANCEL = 'cancel'
}

export enum IStatusValue {
  TRUE = '1',
  FALSE = '0'
}

export interface IPaymentIntent {
  paymentIntentId: string;
  clientSecret: string;
}