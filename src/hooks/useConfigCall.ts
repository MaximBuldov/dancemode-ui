import { useQuery } from '@tanstack/react-query';
import { orderService } from 'services';
import { IKeys } from 'models';
import dayjs from 'dayjs';

import { useProducts } from './useProducts';

export const useConfigCall = (day: dayjs.Dayjs) => {
  const month = day.format('YYYY-MM');

  const { message: { onErrorFn, contextHolder }, products, groupedProducts } = useProducts(day);

  const orders = useQuery({
    queryKey: [IKeys.ORDERS, { month }],
    queryFn: () => orderService.getByMonth(day),
    onError: onErrorFn,
    staleTime: 1000 * 30
  });

  const loading = products.isFetching || orders.isFetching;
  return { loading, contextHolder, orders: orders.data, products: products.data, groupedProducts };
};