import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { IStatus, IStatusValue, IKeys, IROrder, IROrderProduct } from 'models';
import { orderService } from 'services';
import { makeupStore, userStore } from 'stores';

import { useError } from './useError';

interface IMutate { key: IStatus, value: IStatusValue }

export const useUpdateOrder = (day: dayjs.Dayjs, isDeadline: boolean, status: IROrderProduct) => {
  const { onErrorFn, contextHolder } = useError();
  const client = useQueryClient();
  const userId = userStore.data!.id;
  const body = {
    origin: dayjs(day).format('YYYYMMDD'),
    deadline: dayjs(day).add(1, 'month').endOf('month').format('YYYYMMDD'),
    class_name: status.name
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ key, value }: IMutate) => {
      const create_makeup = isDeadline && key === IStatus.CANCEL;
      const data = { key, value, create_makeup, userId, ...body };
      return orderService.update({ data, order: status?.order, item: status!.id });
    },
    onError: onErrorFn,
    onSuccess: (data, values) => {
      client.setQueriesData([IKeys.ORDERS, { month: dayjs(day).month() }], (orders: IROrder[] | undefined) => {
        if (orders) {
          const updated = orders.map(order => order.id === status.order ? ({
            ...order,
            line_items: data.orders
          }) : order);
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