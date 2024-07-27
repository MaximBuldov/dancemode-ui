import { DeleteTwoTone } from '@ant-design/icons';
import { UseMutationResult } from '@tanstack/react-query';
import { Spin } from 'antd';

interface DeleteIconProps<T> {
  remove: UseMutationResult<T, Error, number>;
  id: number;
}

export const DeleteIcon = <T,>({ remove, id }: DeleteIconProps<T>) => {
  return remove.isPending && remove.variables === id ? (
    <Spin spinning />
  ) : (
    <DeleteTwoTone twoToneColor="#cf1322" onClick={() => remove.mutate(id)} />
  );
};
