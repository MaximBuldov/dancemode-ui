import { IProduct } from 'models';

import { $wc } from '../http';

class ProductService {
  async getAll(params?: any) {
    try {
      const res = await $wc.get('/wc/v3/products', {
        params: {
          _fields: 'id,name,price,date_time',
          ...params
        }
      });
      return res.data as IProduct[];
    } catch (error) {
      throw error;
    }
  }

  async createOne(data: any) {
    try {
      const res = await $wc.post('/wc/v3/products', data);
      return res.data as IProduct[];
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: any) {
    try {
      const res = await $wc.post('/wc/v3/products/batch', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();