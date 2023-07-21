import { useQuery } from '@tanstack/react-query';
import { makeupService, productService } from 'services';
import { makeupStore, productStore, userStore } from 'stores';
import { IKeys } from 'models';
import dayjs from 'dayjs';

import { useError } from './useError';

export const useConfigCall = () => {
  const { onErrorFn, contextHolder } = useError();
  const today = dayjs().format('YYYYMMDD');

  const { isFetching: productsLoading } = useQuery({
    queryKey: [IKeys.PRODUCTS],
    queryFn: productService.getAll,
    enabled: !productStore.data && userStore.isAuth,
    onSuccess: (data) => productStore.setProducts(data),
    onError: onErrorFn
  });

  const { isFetching: makeupsLoading, data: makeups } = useQuery({
    queryKey: [IKeys.MAKEUPS, { today }],
    queryFn: () => makeupService.getCurrent(userStore.data!.id, today),
    onSuccess: (data) => makeupStore.setMakeups(data),
    onError: onErrorFn,
    enabled: !!userStore.data?.id,
    staleTime: 1000 * 60
  });

  const loading = productsLoading || makeupsLoading;
  return { loading, contextHolder, makeups };
};