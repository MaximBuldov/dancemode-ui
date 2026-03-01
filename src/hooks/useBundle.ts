import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IBundle, IKeys } from 'models';
import { bundleService } from 'services';

export const useBundle = () => {
  const client = useQueryClient();
  const queryKey = [IKeys.BUNDELS];
  const get = useQuery({
    queryKey,
    queryFn: () => bundleService.getAll()
  });

  const update = useMutation({
    mutationFn: bundleService.update,
    onSuccess: (data) => {
      client.setQueryData(
        queryKey,
        (res: IBundle[] | undefined) =>
          res && res.map((el) => (el.id === data.id ? data : el))
      );
    }
  });

  const create = useMutation({
    mutationFn: bundleService.create,
    onSuccess: (data) => {
      client.setQueryData(
        queryKey,
        (res: IBundle[] | undefined) => res && [...res, data]
      );
    }
  });

  const remove = useMutation({
    mutationFn: (id: number) => bundleService.remove(id),
    onSuccess: (data) => {
      client.setQueryData(
        queryKey,
        (res: IBundle[] | undefined) =>
          res && res.filter((el) => el.id !== data.id)
      );
    }
  });

  return { get, update, remove, create };
};
