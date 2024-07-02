import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IROrder } from 'models';
import { IUpdate, orderService } from 'services';

export const useUpdateOrder = (queryKey: any[], onSuccess?: () => void) => {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: IUpdate) => orderService.update(data),
    onSuccess: (data) => {
      onSuccess && onSuccess();
      client.setQueryData(queryKey, (store: any) => {
        const newData = (arr: IROrder[]) =>
          arr?.map((el) => (el.id === data.id ? data : el));
        if (Array.isArray(store)) {
          return newData(store);
        } else {
          return { ...store, data: newData(store?.data) };
        }
      });
    }
  });

  return mutation;
};
