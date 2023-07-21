import { IProduct } from 'models';

import { $wc } from '../http';

class ProductService {
  async getAll() {
    try {
      const res = await $wc.get('/wc/v3/products', {
        params: {
          _fields: 'id,name,price,time'
        }
      });
      return res.data as IProduct[];
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();