import { IBatchProducts, IProduct } from 'models';

import { $wc } from '../http';

class ProductService {
  async getAll(params?: any) {
    try {
      const res = await $wc.get('/wc/v3/products', {
        params: {
          _fields: 'id,name,price,date_time,is_canceled,total_sales,stock_status,cancel,confirm,categories,paid,pending,stock_quantity,wait_list',
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
      return res.data as IProduct;
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: any) {
    try {
      const res = await $wc.post('/wc/v3/products/batch', data);
      return res.data as IBatchProducts;
    } catch (error) {
      throw error;
    }
  }

  async update(data: any, id: number) {
    try {
      const res = await $wc.post(`/wc/v3/products/${id}`, data);
      return res.data as IProduct;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const res = await $wc.delete(`/wc/v3/products/${id}`);
      return res.data as IProduct;
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();