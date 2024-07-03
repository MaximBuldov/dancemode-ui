import { IOrder, IOrderStatus, IROrder } from 'models';
import { userStore } from 'stores';

import { $api } from '../http';

export interface IUpdate {
  data: Partial<IROrder>;
  id: string | number;
}

export interface IFilters {
  page?: number;
  per_page?: number;
  customer_id?: number;
  product?: number;
  status?: IOrderStatus[];
  after?: Date;
  before?: Date;
}

class OrderService {
  async create(data: Partial<IOrder>) {
    try {
      return (await $api.post<IROrder>('/orders', data)).data;
    } catch (error) {
      throw error;
    }
  }

  async getByYear(date: string) {
    try {
      const res = await $api.get<IROrder[]>('/orders', {
        params: {
          customer: userStore.data?.id,
          date,
          status: ['completed', 'pending']
        }
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async getMyAll(page: number) {
    try {
      return await $api.get<IROrder[]>('/orders', {
        params: {
          customer: userStore.data?.id,
          per_page: 10,
          page
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async getAll(params: IFilters) {
    try {
      return await $api.get<IROrder[]>('/orders', { params });
    } catch (error) {
      throw error;
    }
  }

  async update({ data, id }: IUpdate) {
    try {
      const res = await $api.patch<IROrder>(`/orders/${id}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string | number) {
    try {
      const res = await $api.delete<IROrder>(`/orders/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async stripe(data: { total: number; customer?: number }) {
    try {
      const res = await $api.post('/orders/process-payment', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const orderService = new OrderService();
