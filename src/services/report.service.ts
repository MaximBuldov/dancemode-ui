import { IReport, IReportCost } from 'models';

import { $api } from '../http';

interface ReportParams {
  from?: string;
  to?: string;
}

class ReportService {
  async getAll(params?: ReportParams) {
    try {
      const res = await $api.get('/reports', { params });
      return res.data as IReport[];
    } catch (error) {
      throw error;
    }
  }

  async create(data: Partial<IReport>) {
    try {
      const res = await $api.post('/reports', data);
      return res.data as IReport;
    } catch (error) {
      throw error;
    }
  }

  async update(data: IReportCost[]) {
    try {
      const res = await $api.patch('/reports', data);
      return res.data as IReport;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const res = await $api.delete(`/reports/${id}`);
      return res.data as IReport;
    } catch (error) {
      throw error;
    }
  }
}

export const reportService = new ReportService();
