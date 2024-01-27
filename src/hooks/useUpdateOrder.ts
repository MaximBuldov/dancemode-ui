import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUpdate, orderService } from 'services';
import { IROrder } from 'models';

import { useError } from './useError';

export const useUpdateOrder = (queryKey: any[], onSuccess?: () => void) => {
  const { onErrorFn, contextHolder, messageApi } = useError();
  const client = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: IUpdate) => orderService.update(data),
    onError: onErrorFn,
    onSuccess: (data) => {
      onSuccess && onSuccess();
      client.setQueriesData(
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

  return { mutate, isLoading, contextHolder };
};