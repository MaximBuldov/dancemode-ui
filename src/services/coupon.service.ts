import { ICoupon } from 'models';

import { $api } from '../http';
import { BaseService } from './base.service';

const ENDPOINT = '/coupon';

class CouponService extends BaseService<ICoupon> {
  constructor() {
    super(ENDPOINT);
  }
  async getMy(params?: any) {
    try {
      const res = await $api.get<ICoupon[]>(`${ENDPOINT}/my`, { params });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async validate(code: string) {
    try {
      const res = await $api.post<ICoupon>('/coupon/validate', { code });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllCoupons(page: number) {
    try {
      return await $api.get<ICoupon[]>('/coupon', {
        params: { page }
      });
    } catch (error) {
      throw error;
    }
  }
}

export const couponService = new CouponService();
