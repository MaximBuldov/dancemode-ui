export interface IReport {
  id?: number;
  date: string;
  cash: number;
  card: number;
  coupons: number;
  revenue: number;
  profit: number;
  beg: number;
  beg_sum: number;
  adv: number;
  adv_sum: number;
  students: number;
  costs?: IReportCost[];
  completed: boolean;
  stripe?: number;
}

export interface IReportCost {
  name: string;
  sum: number;
  date: string;
}
