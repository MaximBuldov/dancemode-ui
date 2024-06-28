import { ICoupon } from 'models';

import { $api } from '../http';

class CouponService {
  async getMy(params?: any) {
    try {
      const res = await $api.get<ICoupon[]>('/coupon', { params });
      return res.data;
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
