import { ITemplate } from 'models';
import { $api } from '../http';

const TEMPLATE_ENDPOINT = '/template';

class TemplateService {
  async getAll() {
    try {
      const res = await $api.get<ITemplate[]>(TEMPLATE_ENDPOINT);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async create(data: Pick<ITemplate, 'name' | 'price'>) {
    try {
      const res = await $api.post<ITemplate>(TEMPLATE_ENDPOINT, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async update({ id, ...data }: Partial<ITemplate>) {
    try {
      const res = await $api.patch<ITemplate>(
        `${TEMPLATE_ENDPOINT}/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const res = await $api.delete<ITemplate>(`${TEMPLATE_ENDPOINT}/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const templateService = new TemplateService();
