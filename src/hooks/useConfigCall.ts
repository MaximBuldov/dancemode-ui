import { useQuery } from '@tanstack/react-query';
import { couponService, orderService } from 'services';
import { cartStore, userStore } from 'stores';
import { IKeys } from 'models';
import dayjs from 'dayjs';

import { useProducts } from './useProducts';

export const useConfigCall = (day: dayjs.Dayjs) => {
  const month = day.format('YYYY-MM');

  const { message: { onErrorFn, contextHolder }, products, groupedProducts } = useProducts(day);

  const coupons = useQuery({
    queryKey: [IKeys.COUPONS],
    queryFn: () => couponService.getMy(),
    select: (data) => data.data,
    onSuccess: (data) => cartStore.setCoupons(data),
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

  const loading = products.isFetching || coupons.isFetching || orders.isFetching;
  return { loading, contextHolder, orders: orders.data, products: products.data, groupedProducts };
};