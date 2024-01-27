import { CloseCircleOutlined, MoreOutlined, SyncOutlined } from '@ant-design/icons';
import { Typography, Row, Col, Space, Checkbox, Tag, Dropdown, Flex } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { IKeys, IProduct, IROrder } from 'models';
import { useState } from 'react';

import { CancelOrderModal } from './cancel-order-modal';

interface PaidClassProps {
  product: IProduct;
  isExpired: boolean;
  order?: IROrder;
}

export const PrePaidClass = observer(({ product, isExpired, order }: PaidClassProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const classTime = dayjs(product.date_time);

  const items = [{
    label: <Typography.Text type="danger"><CloseCircleOutlined /> Cancel order</Typography.Text>,
    key: 'cancel',
    onClick: () => setModalOpen(true)
  }];

  return (
    <Row justify="space-between">
      <Col>
        <Space>
          <Checkbox disabled />
          <Typography>{product.name}: {classTime.format('ha')}</Typography>
          <div>
            <Tag icon={<SyncOutlined spin />} color="cyan">Preordered</Tag>
          </div>
        </Space>
      </Col>
      {!isExpired && (
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
      <CancelOrderModal
        open={!!modalOpen}
        setOpen={setModalOpen}
        id={order?.id!}
        queryKey={[IKeys.ORDERS, { month: classTime.format('YYYY-MM') }]}
      >
        <Flex wrap="wrap">{order?.line_items.map(el => <Tag key={el.id} color="geekblue">{el.name}: {dayjs(el.date_time).format('MM/DD ha')}</Tag>)}</Flex>
      </CancelOrderModal>
    </Row>
  );
});