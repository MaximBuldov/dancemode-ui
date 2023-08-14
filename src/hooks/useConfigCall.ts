import { useQuery } from '@tanstack/react-query';
import { makeupService, orderService } from 'services';
import { makeupStore, userStore } from 'stores';
import { IKeys } from 'models';
import dayjs from 'dayjs';

import { useProducts } from './useProducts';

export const useConfigCall = (day: dayjs.Dayjs) => {
  const today = dayjs().format('YYYYMMDD');
  const month = day.format('YYYY-MM');

  const { message: { onErrorFn, contextHolder }, products, groupedProducts } = useProducts(day);

  const makeups = useQuery({
    queryKey: [IKeys.MAKEUPS, { today }],
    queryFn: makeupService.getCurrent,
    onSuccess: (data) => makeupStore.setMakeups(data),
    onError: onErrorFn,
    enabled: !!userStore.data?.id,
    staleTime: 1000 * 60
  });

  const orders = useQuery({
    queryKey: [IKeys.ORDERS, { month }],
    queryFn: () => orderService.getByMonth(day),
    onError: onErrorFn,
    staleTime: 1000 * 30
  });

  const loading = products.isFetching || makeups.isFetching || orders.isFetching;
  return { loading, contextHolder, orders: orders.data, products: products.data, groupedProducts };
};