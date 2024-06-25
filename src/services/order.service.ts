import { AxiosResponse } from 'axios';
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
  min_date?: string;
  max_date?: string;
}

const _fields =
  'id,status,date_created,total,customer_id,line_items,customer_name,payment_method,note,coupon_lines,group';

class OrderService {
  async create(data: Partial<IOrder>) {
    try {
      const res = await $api.post('/order', data, {
        params: { _fields }
      });
      return res.data as IROrder;
    } catch (error) {
      throw error;
    }
  }

  async getByYear(date: string) {
    try {
      const res = await $api.get('/order', {
        params: {
          _fields,
          customer: userStore.data?.id,
          date,
          status: ['completed', 'pending']
        }
      });
      return res.data as IROrder[];
    } catch (error) {
      throw error;
    }
  }

  async getMyAll(page: number) {
    try {
      const res = await $api.get('/order', {
        params: {
          _fields,
          customer: userStore.data?.id,
          per_page: 10,
          dp: 0,
          page
        }
      });
      return res as AxiosResponse<IROrder[]>;
    } catch (error) {
      throw error;
    }
  }

  async getAll(values: IFilters) {
    try {
      const res = await $api.get<IROrder[]>('/order', {
        params: {
          _fields,
          dp: 0,
          ...values
        }
      });
      return res as AxiosResponse<IROrder[]>;
    } catch (error) {
      throw error;
    }
  }

  async update({ data, id }: IUpdate) {
    try {
      const res = await $api.patch(`/order/${id}`, data);
      return res.data as IROrder;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string | number) {
    try {
      const res = await $api.delete(`/order/${id}`);
      return res.data as IROrder;
    } catch (error) {
      throw error;
    }
  }

  async stripe(data: { total: number; customer?: number }) {
    try {
      const res = await $api.post('/order/process-payment', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const orderService = new OrderService();
