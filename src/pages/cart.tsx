import { DeleteOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, List, Result, Row, Typography } from 'antd';
import { CartItem } from 'components';
import { useError } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IKeys, IROrder } from 'models';
import { useNavigate } from 'react-router-dom';
import { orderService } from 'services';
import { cartStore } from 'stores';
import { prepareOrder } from 'utils';

export const Cart = observer(() => {
  const { onErrorFn, contextHolder } = useError();
  const client = useQueryClient();
  const { mutate, isSuccess, isLoading, data } = useMutation({
    mutationFn: orderService.create,
    onSuccess: (data) => {
      cartStore.clearCart();
      client.setQueriesData(
        [IKeys.ORDERS],
        (orders: IROrder[] | undefined) => orders ? [...orders, data] : orders
      );
    },
    onError: onErrorFn
  });
  const navigate = useNavigate();

  return isSuccess ? (
    <Result
      status="success"
      title="Classes Successfully Purchased!"
      subTitle={`Order number: ${data.id}`}
      extra={[
        <Button key="home" type="primary" onClick={() => navigate('/classes')} block>
          Go to Classes
        </Button>
      ]}
    />
  ) : (
    <>
      <List
        header={renderHeader()}
        footer={renderFooter()}
        bordered={false}
        dataSource={cartStore.data}
        renderItem={(item) => (
          <List.Item>
            <CartItem item={item} />
          </List.Item>
        )}
      />
      <Button
        type="primary"
        block
        icon={<DollarOutlined />}
        disabled={!cartStore.count}
        onClick={() => mutate(prepareOrder(cartStore.data))}
        loading={isLoading}
      >
        Paid
      </Button>
      {contextHolder}
    </>
  );

  function renderHeader() {
    return (
      <Row align="middle" justify="space-between">
        <Typography.Text strong style={{ fontSize: 20 }}><ShoppingCartOutlined /> Cart</Typography.Text>
        <Button
          onClick={() => cartStore.clearCart()}
          danger
          type="text"
          icon={<DeleteOutlined />}
        >
          Clear cart
        </Button>
      </Row>
    );
  }

  function renderFooter() {
    return (
      <Row align="top" justify="space-between">
        <Col>
          <Typography.Text strong>Total count: <span style={{ color: '#1677ff' }}>{cartStore.count}</span></Typography.Text>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Row>
            <Col span={12}>Subtotal:</Col>
            <Col span={12}><Typography.Link strong>${cartStore.subtotal}</Typography.Link></Col>
            <Col span={12}>Sale:</Col>
            <Col span={12}><Typography.Link strong>${cartStore.total - cartStore.subtotal}</Typography.Link></Col>
            <Col span={12}><b>Total:</b></Col>
            <Col span={12}><Typography.Link strong>${cartStore.total}</Typography.Link></Col>
          </Row>
        </Col>
      </Row>
    );
  }
});