export interface IResponseError extends Error {
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
  STRIPE = 'stripe',
  PAYMENTS = 'payments'
}