import { ICategory, PaginationParam } from 'models';
import { $api } from '../http';

class CategoryService {
  async getAll(params?: PaginationParam) {
    try {
      const res = await $api.get<ICategory[]>('/category', { params });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async create(data: Pick<ICategory, 'name'>) {
    try {
      const res = await $api.post<ICategory>('/category', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async update({ id, ...data }: ICategory) {
    try {
      const res = await $api.patch<ICategory>(`/category/${id}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const res = await $api.delete<ICategory>(`/category/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
