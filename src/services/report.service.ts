import { IReport } from 'models';

import { $api } from '../http';

interface ReportParams {
  from?: string,
  to?: string
}

class ReportService {
  async getAll(params?: ReportParams) {
    try {
      const res = await $api.get('/wp/v2/reports', { params });
      return res.data as IReport[];
    } catch (error) {
      throw error;
    }
  }

  async create(data: Partial<IReport>) {
    try {
      const res = await $api.post('/wp/v2/reports', { acf: data, title: data.date, status: 'publish' });
      return res.data as IReport;
    } catch (error) {
      throw error;
    }
  }

  async update({ data, id }: { data: Partial<IReport>, id: number }) {
    try {
      const res = await $api.post(`/wp/v2/reports/${id}`, { acf: data });
      return res.data as IReport;
    } catch (error) {
      throw error;
    }
  }
};

export const reportService = new ReportService();