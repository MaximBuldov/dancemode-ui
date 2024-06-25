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
      <Col span={14}>
        <b>{item.name}:</b> {dayjs(item.date_time).format('MMMM DD - dd')}
      </Col>
      <Col span={6}>
        <Price total={item.price} subtotal={item.price} />
        {/* <Price total={item.total || item.price} subtotal={item.price} /> */}
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
