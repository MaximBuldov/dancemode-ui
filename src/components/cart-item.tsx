import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
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
        <Typography.Link
          strong={!item?.total}
          delete={!!item?.total}
          disabled={!!item?.total}
        >
          ${item.price}
        </Typography.Link>
        {!!item.total && (
          <Typography.Link strong style={{ marginLeft: 10 }}>
            ${item.total}
          </Typography.Link>
        )}
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