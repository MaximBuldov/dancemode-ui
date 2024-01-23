import { userStore } from 'stores';
import { ICoupon } from 'models';

import { $wc } from '../http';

class CouponService {
  async getMy(params?: any) {
    try {
      const res = await $wc.get<ICoupon[]>('/wc/v3/coupons', {
        params: {
          user: userStore.data?.id,
          ...params
        }
      });
      res.data = res.data.filter(el => el.usage_count < el.usage_limit);
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export const couponService = new CouponService();