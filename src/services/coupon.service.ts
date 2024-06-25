import { ICoupon } from 'models';
import { userStore } from 'stores';

import { $api } from '../http';

class CouponService {
  async getMy(params?: any) {
    try {
      const res = await $api.get<ICoupon[]>('/coupon', {
        params: {
          user: userStore.data?.id,
          ...params
        }
      });
      res.data = res.data.filter((el) => el.usage_count < el.usage_limit);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async create(data?: Partial<ICoupon>) {
    try {
      const res = await $api.post<ICoupon>('/coupon', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const couponService = new CouponService();
