import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { ICategory, IKeys } from 'models';
import { categoryService } from 'services/category.setvice';

export const useCategory = (page: number) => {
  const client = useQueryClient();
  const get = useQuery({
    queryKey: [IKeys.CATEGORIES, { page }],
    queryFn: () => categoryService.getAll({ page })
  });

  const update = useMutation({
    mutationFn: (cat: ICategory) => categoryService.update(cat),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.CATEGORIES, { page }],
        (res: AxiosResponse<ICategory[]> | undefined) =>
          res && {
            ...res,
            data: res.data.map((el) => (el.id === data.id ? data : el))
          }
      );
    }
  });

  const create = useMutation({
    mutationFn: (name: string) => categoryService.create({ name }),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.CATEGORIES, { page }],
        (res: AxiosResponse<ICategory[]> | undefined) =>
          res && { ...res, data: [...res.data, data] }
      );
    }
  });

  const remove = useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.CATEGORIES, { page }],
        (res: AxiosResponse<ICategory[]> | undefined) =>
          res && { ...res, data: res.data.filter((el) => el.id !== data.id) }
      );
    }
  });

  return { get, update, remove, create };
};
