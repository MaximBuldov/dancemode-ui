import { Modal } from 'antd';
import { useUpdateOrder } from 'hooks';
import { IOrderStatus } from 'models';
import { useCallback, useState } from 'react';

interface OrderModalActionsProps {
  setOpen: (bool: number) => void;
  id: number;
  queryKey: any[];
}

export const OrderModalActions = ({ setOpen, id, queryKey }: OrderModalActionsProps) => {
  const { contextHolder, isPending, mutate } = useUpdateOrder(queryKey, () => { setOpen(0); });
  const [loading, setLoading] = useState<IOrderStatus>();

  const onClick = useCallback((status: IOrderStatus) => {
    mutate({ data: { status }, id });
    setLoading(status);
  }, [id, mutate]);

  return (
    <>
      <Modal
        title={`Update order #${id} status`}
        open={!!id}
        destroyOnClose
        onCancel={() => setOpen(0)}
        cancelButtonProps={{
          onClick: () => onClick(IOrderStatus.CANCELLED),
          danger: true,
          type: 'primary',
          loading: isPending && loading === IOrderStatus.CANCELLED,
          disabled: isPending && loading !== IOrderStatus.CANCELLED
        }}
        okText="Confirm"
        okButtonProps={{
          onClick: () => onClick(IOrderStatus.COMPLETED),
          type: 'primary',
          loading: isPending && loading === IOrderStatus.COMPLETED,
          disabled: isPending && loading !== IOrderStatus.COMPLETED
        }}
      />
      {contextHolder}
    </>
  );
};