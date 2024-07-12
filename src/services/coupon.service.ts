import { ICoupon } from 'models';

import { $api } from '../http';

class CouponService {
  async getMy(params?: any) {
    try {
      const res = await $api.get<ICoupon[]>('/coupon/my', { params });
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

  async create(data?: Partial<ICoupon>) {
    try {
      const res = await $api.post<ICoupon>('/coupon', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async update(data: ICoupon) {
    try {
      const res = await $api.patch<ICoupon>(`/coupon/${data.id}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async getAll(page: number) {
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
