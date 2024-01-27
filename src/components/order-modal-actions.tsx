import { Modal } from 'antd';
import { useUpdateOrder } from 'hooks';
import { IOrderStatus } from 'models';

interface OrderModalActionsProps {
  setOpen: (bool: number) => void;
  id: number;
  queryKey: any[];
}

export const OrderModalActions = ({ setOpen, id, queryKey }: OrderModalActionsProps) => {
  const { contextHolder, isLoading, mutate } = useUpdateOrder(queryKey, () => { setOpen(0); });

  return (
    <>
      <Modal
        title={`Update order #${id} status`}
        open={!!id}
        destroyOnClose
        cancelButtonProps={{
          onClick: () => mutate({ data: { status: IOrderStatus.CANCELLED }, id }),
          danger: true,
          type: 'primary',
          loading: isLoading
        }}
        okText="Confirm"
        okButtonProps={{
          onClick: () => mutate({ data: { status: IOrderStatus.COMPLETED }, id }),
          type: 'primary',
          loading: isLoading
        }}
      />
      {contextHolder}
    </>
  );
};