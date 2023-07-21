export interface IOrder {
  customer_id: number;
  line_items: IOrderProduct[];
  meta_data: IMetaData[];
}

export interface IROrder extends IOrder {
  id: number;
  status: string;
  date: string;
  total: string;
  line_items: IROrderProduct[];
}

export interface IOrderProduct {
  product_id: number;
  subtotal: string;
  total: string;
  meta_data: IMetaData[];
}

export interface IROrderProduct extends IOrderProduct {
  id: number;
  name: string;
  order: number;
}

export interface IMetaData {
  id?: number;
  key: string;
  value: string;
}

export enum IStatus {
  DATE = 'date',
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  RESCHEDULE = 'reschedule'
}

export enum IStatusValue {
  TRUE = '1',
  FALSE = '0'
}