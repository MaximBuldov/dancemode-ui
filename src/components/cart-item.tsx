import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { Price } from 'components';
import dayjs from 'dayjs';
import { CLASS_TIME_FORMAT, IProduct } from 'models';
import { cartStore } from 'stores';

interface CartItemProps {
  item: IProduct;
}

export const CartItem = ({ item }: CartItemProps) => {
  return (
    <Row align="middle" justify="space-between" style={{ width: '100%' }}>
      <Col span={16} style={{ fontSize: 12 }}>
        <b>{item.name}: </b>
        {item.name.length > 20 && <br />}
        {dayjs(item.date_time).format(`MMM D - ddd - ${CLASS_TIME_FORMAT}`)}
      </Col>
      <Col span={6}>
        <Price total={item.sale_price || 0} subtotal={item.price} />
      </Col>
      <Col span={2} style={{ textAlign: 'right' }}>
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
