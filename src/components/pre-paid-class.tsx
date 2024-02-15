import { SyncOutlined } from '@ant-design/icons';
import { Typography, Row, Col, Space, Checkbox, Tag } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { IProduct } from 'models';

interface PaidClassProps {
  product: IProduct;
}

export const PrePaidClass = observer(({ product }: PaidClassProps) => {
  const classTime = dayjs(product.date_time);

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
    </Row>
  );
});