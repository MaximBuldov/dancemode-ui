import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { Price } from 'components';
import dayjs from 'dayjs';
import { IProduct } from 'models';
import { cartStore } from 'stores';

interface CartItemProps {
  item: IProduct;
}

export const CartItem = ({ item }: CartItemProps) => {
  return (
    <Row align="middle" justify="space-between" style={{ width: '100%' }}>
      <Col span={14} style={{ fontSize: 12 }}>
        <b>{item.name}:</b> {dayjs(item.date_time).format('MMM D - dd - ha')}
      </Col>
      <Col span={6}>
        <Price total={item.sale_price || 0} subtotal={item.price} />
      </Col>
      <Col span={4} style={{ textAlign: 'right' }}>
        <Button
          icon={<DeleteOutlined />}
          danger
          type="text"
          onClick={() => cartStore.remove(item)}
        />
      </Col>
    </Row>
  );
};
