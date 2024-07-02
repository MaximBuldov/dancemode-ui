import { App, Button, Modal } from 'antd';
import { useDeleteOrder, useUpdateOrder } from 'hooks';
import { IOrderStatus } from 'models';
import { useCallback, useState } from 'react';

interface OrderModalActionsProps {
  setOpen: (bool: number) => void;
  id: number;
  queryKey: any[];
}

export const OrderModalActions = ({
  setOpen,
  id,
  queryKey
}: OrderModalActionsProps) => {
  const { message } = App.useApp();
  const onSuccessAction = useCallback(() => {
    setOpen(0);
    message.success('Done!');
  }, [message, setOpen]);

  const updateOrder = useUpdateOrder(queryKey, onSuccessAction);
  const deleteOrder = useDeleteOrder(id, queryKey, onSuccessAction);
  const [loading, setLoading] = useState<IOrderStatus>();

  const onClick = useCallback(
    (status: IOrderStatus) => {
      updateOrder.mutate({ data: { status }, id });
      setLoading(status);
    },
    [id, updateOrder]
  );

  return (
    <Modal
      title={`Update order #${id} status`}
      open={!!id}
      destroyOnClose
      onCancel={() => setOpen(0)}
      footer={() => (
        <>
          <Button
            onClick={() => onClick(IOrderStatus.COMPLETED)}
            type="primary"
            loading={
              updateOrder.isPending && loading === IOrderStatus.COMPLETED
            }
            disabled={
              updateOrder.isPending && loading !== IOrderStatus.COMPLETED
            }
          >
            Confirm
          </Button>
          <Button
            onClick={() => onClick(IOrderStatus.CANCELLED)}
            type="primary"
            loading={
              updateOrder.isPending && loading === IOrderStatus.CANCELLED
            }
            disabled={
              updateOrder.isPending && loading !== IOrderStatus.CANCELLED
            }
            ghost
            danger
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteOrder.mutate()}
            type="primary"
            loading={deleteOrder.isPending}
            disabled={updateOrder.isPending}
            danger
          >
            Delete
          </Button>
        </>
      )}
    />
  );
};
