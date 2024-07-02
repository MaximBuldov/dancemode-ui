import { Key } from 'antd/es/table/interface';
import { IOrderProduct, IROrderProduct } from 'models';
import { $api } from '../http';

class OrderProductService {
  async update(data: Partial<IOrderProduct>, id: number) {
    try {
      const res = await $api.patch(`/order-product/${id}`, data);
      return res.data as IROrderProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateMany(data: Partial<IOrderProduct>, ids: number[] | Key[]) {
    try {
      const res = await $api.patch('/order-product', {
        ...data,
        ids
      });
      return res.data as IROrderProduct;
    } catch (error) {
      throw error;
    }
  }
}

export const orderProductService = new OrderProductService();
