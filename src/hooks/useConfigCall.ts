import { useQuery } from '@tanstack/react-query';
import { makeupService, orderService, productService } from 'services';
import { makeupStore, productStore, userStore } from 'stores';
import { IKeys } from 'models';
import dayjs from 'dayjs';

import { useError } from './useError';

export const useConfigCall = (month: number) => {
  const { onErrorFn, contextHolder } = useError();
  const today = dayjs().format('YYYYMMDD');

  const products = useQuery({
    queryKey: [IKeys.PRODUCTS],
    queryFn: productService.getAll,
    enabled: !productStore.data && userStore.isAuth,
    onSuccess: (data) => productStore.setProducts(data),
    onError: onErrorFn
  });

  const makeups = useQuery({
    queryKey: [IKeys.MAKEUPS, { today }],
    queryFn: () => makeupService.getCurrent(userStore.data!.id, today),
    onSuccess: (data) => makeupStore.setMakeups(data),
    onError: onErrorFn,
    enabled: !!userStore.data?.id,
    staleTime: 1000 * 60
  });

  const orders = useQuery({
    queryKey: [IKeys.ORDERS, { month: month }],
    queryFn: () => orderService.getByMonth(month),
    onError: onErrorFn,
    staleTime: 1000 * 30
  });

  const loading = products.isFetching || makeups.isFetching || orders.isFetching;
  return { loading, contextHolder, orders: orders.data };
};