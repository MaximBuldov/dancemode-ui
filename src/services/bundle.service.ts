import { IBundle, IBundleUpdate } from 'models';
import { $api } from '../http';

const ENDPOINT = '/bundle';

import { BaseService } from './base.service';

class BundleService extends BaseService<IBundle, IBundleUpdate> {
  constructor() {
    super('/bundle');
  }

  async getProductsWithPrice(ids: number[]) {
    try {
      const res = await $api.post<IBundle[]>(`${ENDPOINT}/products`, { ids });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const bundleService = new BundleService();
