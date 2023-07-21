import { IMakeUp } from 'models/makeup.model';

import { $api } from '../http';

class MakeUpService {
  async getCurrent(author: string, today: string) {
    try {
      const res = await $api.get<IMakeUp[]>('/wp/v2/makeups', {
        params: {
          _fields: 'id,author,acf',
          author, today
        }
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async update(data: any, id: number) {
    try {
      const res = await $api.post(`/wp/v2/makeups/${id}`, data);
      return res.data as IMakeUp;
    } catch (error) {
      throw error;
    }
  }
}

export const makeupService = new MakeUpService();