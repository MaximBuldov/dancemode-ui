import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { Price } from 'components';
import dayjs from 'dayjs';
import { ICartProduct } from 'models';
import React from 'react';
import { cartStore } from 'stores';

interface CartItemProps {
  item: ICartProduct
}

export const CartItem = ({ item }: CartItemProps) => {
  return (
    <Row align="middle" justify="space-between" style={{ width: '100%' }}>
      <Col span={14}>
        <b>{item.name}:</b> {dayjs(item.day).format('MMMM DD')}
      </Col>
      <Col span={6}>
        <Price total={item.total || item.price} subtotal={item.price} />
      </Col>
      <Col span={4} style={{ textAlign: 'right' }}>
        <Button
          icon={<DeleteOutlined />}
          danger
          type="text"
          onClick={() => cartStore.removeFromCart(item)}
        />
      </Col>
    </Row>
  );
};