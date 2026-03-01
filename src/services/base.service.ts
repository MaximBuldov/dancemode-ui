import { $api } from '../http';

export class BaseService<T, K = Partial<T>> {
  constructor(protected readonly endpoint: string) {}
  getAll = async (page?: number) => {
    try {
      const res = await $api.get<T[]>(this.endpoint, {
        params: { page }
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  create = async (data: Omit<T, 'id'>) => {
    try {
      const res = await $api.post<T>(this.endpoint, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  update = async ({ id, ...data }: K & { id: number }) => {
    try {
      const res = await $api.patch<T>(`${this.endpoint}/${id}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  remove = async (id: number) => {
    try {
      const res = await $api.delete<T>(`${this.endpoint}/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  };
}
