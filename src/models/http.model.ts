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
  MAKEUPS = 'makeups'
}