import { CloseCircleOutlined, CheckCircleOutlined, MoreOutlined, CreditCardOutlined, SyncOutlined } from '@ant-design/icons';
import { MenuProps, Typography, Row, Col, Space, Checkbox, Tag, Dropdown, Modal } from 'antd';
import dayjs from 'dayjs';
import { useProductStatusUpdate } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IProduct, IStatus } from 'models';
import { useMemo, useState } from 'react';
import { userStore } from 'stores';

interface PaidClassProps {
  product: IProduct;
  isExpired: boolean;
  isPaid: boolean;
  isPrepaid: boolean;
}

export const PaidClass = observer(({ product, isExpired, isPaid, isPrepaid }: PaidClassProps) => {
  const [modalOpen, setModalOpen] = useState<IStatus | null>(null);
  const [seePolicy, setSeePolicy] = useState(false);
  const classTime = dayjs(product.date_time);

  const isConfirmed = userStore.checkUserId(product.confirm);
  const isCanceled = userStore.checkUserId(product.cancel);

  const { mutate, isPending, contextHolder } = useProductStatusUpdate({
    day: classTime,
    product_id: product.id,
    isPaid,
    onSuccess: () => setModalOpen(null)
  });

  const isConfirmModal = modalOpen === IStatus.CONFIRM;

  const items = useMemo(() => {
    const elements: MenuProps['items'] = [];

    if (!isCanceled) {
      elements.push({
        label: <Typography.Text type="danger"><CloseCircleOutlined /> Cancel</Typography.Text>,
        key: 'cancel',
        onClick: () => setModalOpen(IStatus.CANCEL)
      });
    }

    if (!isConfirmed && !isCanceled) {
      elements.push({
        label: <Typography.Text type="success"><CheckCircleOutlined /> Confirm</Typography.Text>,
        key: 'Confirm',
        onClick: () => setModalOpen(IStatus.CONFIRM)
      });
    }

    return elements;
  }, [isCanceled, isConfirmed]);

  return (
    <Row justify="space-between">
      <Col>
        <Space>
          <Checkbox disabled />
          <Typography>{product.name}: {classTime.format('ha')}</Typography>
          <div>
            {isPaid && <Tag icon={<CreditCardOutlined />} color="processing">Paid</Tag>}
            {isPrepaid && <Tag icon={<SyncOutlined spin />} color="cyan">Preordered</Tag>}
            {(isConfirmed && !isCanceled) && <Tag icon={<CheckCircleOutlined />} color="success">Confirmed</Tag>}
            {isCanceled && <Tag icon={<CloseCircleOutlined />} color="error">Canceled</Tag>}
          </div>
        </Space>
      </Col>
      {(!isExpired && !!items.length) && (
        <Col>
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
          >
            <MoreOutlined />
          </Dropdown>
        </Col>
      )}
      {contextHolder}
      <Modal
        title={`Class ${isConfirmModal ? 'confirmation' : 'cancellation'}: ${classTime.format('MM/DD ha')} - ${product.name.toLocaleLowerCase()}`}
        open={!!modalOpen}
        onOk={() => mutate({ key: modalOpen! })}
        confirmLoading={isPending}
        onCancel={() => {
          setModalOpen(null);
          setSeePolicy(false);
        }}
        cancelText="Close"
        okButtonProps={{
          danger: !isConfirmModal
        }}
        okText={isConfirmModal ? 'Confirm' : 'Confirm cancellation'}
      >
        <div>
          {`${isConfirmModal ? 'Do you want to confirm?' : 'Are you sure you want to cancel? Cancel 5 hours before class for a coupon; within 5 hours, no refunds. '} `}
          {(!seePolicy && !isConfirmModal) && <Typography.Link onClick={() => setSeePolicy(true)}>See cancelation policy</Typography.Link>}
        </div>
        {seePolicy && (
          <div className="policy">
            If unable to attend, kindly cancel in your account at least 5 hours prior. For no-call, no-show, or cancellations less than 5 hours prior to the class, the class will still be deducted from your package, except in the case of emergencies.
          </div>
        )}
      </Modal>
    </Row>
  );
});