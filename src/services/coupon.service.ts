import { userStore } from 'stores';
import { ICoupon } from 'models';

import { $wc } from '../http';

class CouponService {
  async getMy() {
    try {
      const res = await $wc.get<ICoupon[]>('/wc/v3/coupons', {
        params: {
          user: userStore.data?.id
        }
      });
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export const couponService = new CouponService();