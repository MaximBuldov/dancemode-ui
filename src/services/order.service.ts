import { IOrder, IROrderProduct, IROrder, IStatus, IStatusValue } from 'models';
import { userStore } from 'stores';
import dayjs from 'dayjs';

import { $api, $wc } from '../http';

interface IUpdate {
  data: {
    key: IStatus,
    value: IStatusValue,
    create_makeup: boolean,
    userId: string,
    origin: string,
    deadline: string,
    class_name?: string
  },
  order: number,
  item: number
}

interface IUpdateResponse {
  orders: IROrderProduct[],
  makeup_id: number
}

class OrderService {
  async create(data: IOrder) {
    try {
      const res = await $wc.post('/wc/v3/orders', data);
      return res.data as IROrder;
    } catch (error) {
      throw error;
    }
  }

  async getByMonth(month: number) {
    try {
      const res = await $wc.get('/wc/v3/orders', {
        params: {
          _fields: 'id,status,date_created,total,customer_id,line_items',
          customer: userStore.data?.id,
          date: dayjs().month(month).format('YYYYMM')
        }
      });
      return res.data as IROrder[];
    } catch (error) {
      throw error;
    }
  }

  async getAll(page: number) {
    try {
      const res = await $wc.get('/wc/v3/orders', {
        params: {
          _fields: 'id,status,date_created,total,customer_id,line_items',
          customer: userStore.data?.id,
          per_page: 10,
          dp: 0,
          page
        }
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async update({ data, order, item }: IUpdate) {
    try {
      const res = await $api.post(`/custom/v2/order/${order}/${item}`, data);
      return res.data as IUpdateResponse;
    } catch (error) {
      throw error;
    }
  }
}

export const orderService = new OrderService();