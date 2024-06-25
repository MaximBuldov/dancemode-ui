import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { IKeys } from 'models';
import { useMemo } from 'react';
import { productService } from 'services';
import { userStore } from 'stores';
import { groupByDate } from 'utils';

export const useProducts = (day: dayjs.Dayjs) => {
  const month = day.format('YYYY-MM');

  const products = useQuery({
    queryKey: [IKeys.PRODUCTS, { month }],
    queryFn: () => productService.getAll({ month }),
    enabled: userStore.isAuth
  });

  const groupedProducts = useMemo(() => groupByDate(products.data), [products]);

  return { products, groupedProducts };
};
