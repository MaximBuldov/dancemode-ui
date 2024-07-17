export interface IResponseError extends Error {
  code: string;
  data: {
    status: number;
  };
  message: string;
}

export enum IKeys {
  PRODUCTS = 'products',
  ORDERS = 'orders',
  CUSTOMERS = 'customers',
  COUPONS = 'coupons',
  STRIPE = 'stripe',
  PAYMENTS = 'payments',
  REPORTS = 'reports',
  CATEGORIES = 'categories'
}

export enum SecureStore {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken'
}

export interface PaginationParam {
  page: number;
  per_page?: number;
}
