import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICategory, IKeys } from 'models';
import { useMemo } from 'react';
import { categoryService } from 'services';

export const useCategory = () => {
  const client = useQueryClient();
  const queryKey = [IKeys.CATEGORY];
  const get = useQuery({
    queryKey,
    queryFn: () => categoryService.getAll()
  });

  const update = useMutation({
    mutationFn: categoryService.update,
    onSuccess: (data) => {
      client.setQueryData(
        queryKey,
        (res: ICategory[] | undefined) =>
          res && res.map((el) => (el.id === data.id ? data : el))
      );
    }
  });

  const create = useMutation({
    mutationFn: categoryService.create,
    onSuccess: (data) => {
      client.setQueryData(
        queryKey,
        (res: ICategory[] | undefined) => res && [...res, data]
      );
    }
  });

  const remove = useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: (data) => {
      client.setQueryData(
        queryKey,
        (res: ICategory[] | undefined) =>
          res && res.filter((el) => el.id !== data.id)
      );
    }
  });

  const catOptions = useMemo(() => {
    return get.data?.map((el) => ({
      label: el.name,
      value: el.id
    }));
  }, [get.data]);

  return { get, update, remove, create, catOptions };
};
