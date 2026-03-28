import { ICreateProduct, IProduct } from 'models';

import { $api } from '../http';

interface IProductParams {
  month?: string;
}

class ProductService {
  async getAll(params?: IProductParams) {
    try {
      const res = await $api.get('/products', { params });
      return res.data as IProduct[];
    } catch (error) {
      throw error;
    }
  }

  async createOne(data: ICreateProduct) {
    try {
      const res = await $api.post('/products', data);
      return res.data as IProduct;
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: ICreateProduct[]) {
    try {
      const res = await $api.post<IProduct[]>('/products/batch', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async update(data: ICreateProduct, id: number) {
    try {
      const res = await $api.patch(`/products/${id}`, data);
      return res.data as IProduct;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const res = await $api.delete(`/products/${id}`);
      return res.data as IProduct;
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();
