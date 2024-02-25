import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUpdate, orderService } from 'services';
import { IROrder } from 'models';

import { useError } from './useError';

export const useUpdateOrder = (queryKey: any[], onSuccess?: () => void) => {
  const { contextHolder, messageApi } = useError();
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: IUpdate) => orderService.update(data),
    onSuccess: (data) => {
      onSuccess && onSuccess();
      client.setQueryData(
        queryKey,
        (store: any) => {
          const newData = (arr: IROrder[]) => arr.map(el => el.id === data.id ? data : el);
          if (Array.isArray(store)) {
            return newData(store);
          } else {
            return { ...store, data: newData(store.data) };
          }
        });
      messageApi.success('Order was updated!');
    }
  });

  return { mutate, isPending, contextHolder };
};