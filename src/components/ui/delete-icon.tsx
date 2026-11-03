import { DeleteTwoTone } from '@ant-design/icons';
import { UseMutationResult } from '@tanstack/react-query';
import { Spin } from 'antd';
import { statusColors } from 'theme';

interface DeleteIconProps<T> {
  remove: UseMutationResult<T, Error, number>;
  id: number;
  name: string;
}

export const DeleteIcon = <T,>({ remove, id, name }: DeleteIconProps<T>) => {
  return remove.isPending && remove.variables === id ? (
    <Spin spinning />
  ) : (
    <DeleteTwoTone
      twoToneColor={statusColors.error}
      onClick={() => {
        const isConfirm = window.confirm(
          `Are you sure you want to delete ${name}?`
        );
        if (isConfirm) remove.mutate(id);
      }}
    />
  );
};
