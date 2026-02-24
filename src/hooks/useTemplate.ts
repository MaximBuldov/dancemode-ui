import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IKeys, ITemplate } from 'models';
import { templateService } from 'services';

export const useTemplate = () => {
  const client = useQueryClient();
  const get = useQuery({
    queryKey: [IKeys.TEMPLATES],
    queryFn: () => templateService.getAll()
  });

  const update = useMutation({
    mutationFn: templateService.update,
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.TEMPLATES],
        (res: AxiosResponse<ITemplate[]> | undefined) =>
          res && {
            ...res,
            data: res.data.map((el) => (el.id === data.id ? data : el))
          }
      );
    }
  });

  const create = useMutation({
    mutationFn: templateService.create,
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.TEMPLATES],
        (res: AxiosResponse<ITemplate[]> | undefined) =>
          res && { ...res, data: [...res.data, data] }
      );
    }
  });

  const remove = useMutation({
    mutationFn: (id: number) => templateService.remove(id),
    onSuccess: (data) => {
      client.setQueryData(
        [IKeys.TEMPLATES],
        (res: AxiosResponse<ITemplate[]> | undefined) =>
          res && { ...res, data: res.data.filter((el) => el.id !== data.id) }
      );
    }
  });

  return { get, update, remove, create };
};
