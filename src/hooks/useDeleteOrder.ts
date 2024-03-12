import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from 'services';
import { IROrder } from 'models';

export const useDeleteOrder = (id: number | string, queryKey: any[], onSuccess?: () => void) => {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => orderService.delete(id),
    onSuccess: (data) => {
      client.setQueryData(
        queryKey,
        (store: any) => {
          const newData = (arr: IROrder[]) => arr.filter(el => el.id !== data.id);
          if (Array.isArray(store)) {
            return newData(store);
          } else {
            return { ...store, data: newData(store.data) };
          }
        });
      onSuccess && onSuccess();
    }
  });

  return mutation;
};