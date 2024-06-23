import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { IKeys } from 'models';
import { useMemo } from 'react';
import { productService } from 'services';
import { userStore } from 'stores';
import { groupByDate } from 'utils';

import { useError } from './useError';

export const useProducts = (day: dayjs.Dayjs) => {
  const message = useError();
  const month = day.format('YYYY-MM');

  const products = useQuery({
    queryKey: [IKeys.PRODUCTS, { month }],
    queryFn: () => productService.getAll({ month, per_page: 20 }),
    enabled: userStore.isAuth
  });

  const groupedProducts = useMemo(() => groupByDate(products.data), [products]);

  return { products, message, groupedProducts };
};
