import { CloseCircleOutlined, CheckCircleOutlined, DollarOutlined, MoreOutlined } from '@ant-design/icons';
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
  price: number;
}

export const PaidClass = observer(({ product, isExpired, price }: PaidClassProps) => {
  const [modalOpen, setModalOpen] = useState<IStatus | null>(null);
  const [seePolicy, setSeePolicy] = useState(false);
  const classTime = dayjs(product.date_time);
  const userId = userStore.data!.id;
  const { mutate, isLoading, contextHolder } = useProductStatusUpdate(classTime, userId, price, product.id);

  const isConfirmed = Array.isArray(product.confirm) && product.confirm.includes(Number(userId));
  const isCanceled = Array.isArray(product.cancel) && product.cancel.includes(Number(userId));

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
            <Tag icon={<DollarOutlined />} color="processing">Paid</Tag>
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
        title={`Class ${modalOpen}ation: ${classTime.format('MM/DD ha')} - ${product.name.toLocaleLowerCase()}`}
        open={!!modalOpen}
        onOk={() => mutate({ key: modalOpen! })}
        confirmLoading={isLoading}
        onCancel={() => {
          setModalOpen(null);
          setSeePolicy(false);
        }}
        okButtonProps={{
          danger: !isConfirmModal
        }}
        okText={isConfirmModal ? 'Confirm' : 'Confirm cancellation'}
      >
        <div>
          {`${isConfirmModal ? 'Do you want to confirm?' : 'Are you sure you want to cancel? Cancel 5 hours before class for a coupon; within 5 hours, no refunds. '} `}
          {!seePolicy && <Typography.Link onClick={() => setSeePolicy(true)}>See cancelation policy</Typography.Link>}
        </div>
        {seePolicy && (
          <div className="policy">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
          </div>
        )}
      </Modal>
    </Row>
  );
});