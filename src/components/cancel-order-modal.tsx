import { Modal, Typography, message } from 'antd';
import { useUpdateOrder } from 'hooks';
import { IOrderStatus } from 'models';

interface CancelOrderModalProps {
  open: boolean;
  setOpen: (bool: boolean) => void;
  id: number;
  queryKey: any[];
  children?: React.ReactNode;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  open,
  setOpen,
  id,
  children,
  queryKey
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { isPending, mutate } = useUpdateOrder(queryKey, () => {
    setOpen(false);
    messageApi.success('Done!');
  });
  return (
    <>
      <Modal
        title="Order cancellation"
        open={open}
        onOk={() =>
          mutate({
            data: { status: IOrderStatus.CANCELLED },
            id
          })
        }
        confirmLoading={isPending}
        cancelText="Close"
        onCancel={() => setOpen(false)}
        okButtonProps={{
          danger: true
        }}
        okText="Cancel order"
      >
        <Typography.Paragraph>
          Are you sure you want to cancel this order?
        </Typography.Paragraph>
        {children}
      </Modal>
      {contextHolder}
    </>
  );
};
