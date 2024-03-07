import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { IKeys, IOrderStatus, IReport } from 'models';
import { orderService, reportService } from 'services';
import { createReport } from 'utils';

interface UseGetReports {
  from: string,
  to: string
}

export const useGetReports = ({ from, to }: UseGetReports) => {
  const reports = useQuery({
    queryKey: [IKeys.REPORTS, { from, to }],
    queryFn: () => reportService.getAll({
      from, to
    })
  });

  const lastReport = reports.data?.[0];

  const orders = useQuery({
    queryKey: [IKeys.ORDERS],
    queryFn: () => orderService.getAll({
      per_page: 100,
      status: [IOrderStatus.PENDING, IOrderStatus.COMPLETED],
      min_date: lastReport?.completed ? dayjs(lastReport?.date).add(1, 'month').format('YYYY-MM') : lastReport?.date || from,
      max_date: to
    }),
    select: (res) => createReport(res.data),
    enabled: reports.isSuccess
  });

  let combinedData = [...orders.data || [], ...reports.data || []].reduce((acc: IReport[], item) => {
    let existingItem = acc.find(element => element.date === item.date);

    if (existingItem) {
      Object.assign(existingItem, item);
    } else {
      acc.push(item);
    }

    return acc;
  }, []);

  return {
    isPending: reports.isPending || orders.isPending,
    data: (reports.isSuccess && orders.isSuccess) ? combinedData : undefined
  };
};