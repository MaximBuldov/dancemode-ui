import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IROrder } from 'models';
import { orderService } from 'services';

export const useDeleteOrder = (
  id: number | string,
  queryKey: any[],
  onSuccess?: () => void
) => {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => orderService.delete(id),
    onSuccess: (data) => {
      client.setQueryData(queryKey, (store: any) => {
        const newData = (arr: IROrder[]) =>
          arr.filter((el) => el.id !== data.id);
        if (Array.isArray(store)) {
          return newData(store);
        } else {
          return { ...store, data: newData(store.data) };
        }
      });
      onSuccess?.();
    }
  });

  return mutation;
};
