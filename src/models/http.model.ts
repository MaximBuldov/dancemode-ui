export interface IResponseError {
  code: string;
  data: {
    status: number
  };
  message: string;
}

export enum IKeys {
  PRODUCTS = 'products',
  ORDERS = 'orders',
  CUSTOMERS = 'customers',
  COUPONS = 'coupons',
  STRIPE = 'stripe'
}