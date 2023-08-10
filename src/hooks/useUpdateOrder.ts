import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { IStatus, IStatusValue, IKeys, IROrder, IProduct } from 'models';
import { orderService } from 'services';
import { makeupStore, userStore } from 'stores';

import { useError } from './useError';

interface IMutate { key: IStatus, value: IStatusValue }

export const useUpdateOrder = (product: IProduct, order: number, item_id: number) => {
  const { onErrorFn, contextHolder } = useError();
  const client = useQueryClient();
  const userId = userStore.data!.id;
  const day = dayjs(product.date_time);
  const body = {
    origin: day.format('YYYYMMDD'),
    deadline: day.add(1, 'month').endOf('month').format('YYYYMMDD'),
    product_id: product.id,
    product_name: product.name
  };
  const isDeadline = dayjs().isBefore(day.subtract(5, 'hour'));

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ key, value }: IMutate) => {
      const create_makeup = isDeadline && key === IStatus.CANCEL;
      const data = { key, value, create_makeup, userId, ...body };
      return orderService.update({ data, order, item: item_id });
    },
    onError: onErrorFn,
    onSuccess: (data, values) => {
      client.setQueriesData([IKeys.ORDERS, { month: day.format('YYYY-MM') }], (orders: IROrder[] | undefined) => {
        if (orders) {
          const updated = orders.map(el => el.id === order ? ({
            ...el,
            line_items: data.orders
          }) : el);
          return updated;
        }

        return orders;
      });

      if (isDeadline && values.key === IStatus.CANCEL) {
        makeupStore.addMakeup({ author: Number(userId), acf: body, id: data.makeup_id });
      }
    }
  });

  return { contextHolder, mutate, isLoading };
};