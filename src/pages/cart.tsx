import { CreditCardOutlined, DeleteOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Col, Flex, List, Row, Typography } from 'antd';
import { CartItem, PromoCode, SuccessPage } from 'components';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { cartStore } from 'stores';
import * as routes from 'routes/consts';
import { useCreateOrder, useError } from 'hooks';

export const Cart = observer(() => {
  const navigate = useNavigate();
  const { onErrorFn, contextHolder } = useError();
  const order = useCreateOrder({ paymentIntentId: 'cash', onErrorFn, onSuccess: () => cartStore.clear() });

  return (
    <>
      {order.isSuccess ? (
        <SuccessPage order={order.data} />
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
            )} />
          <Flex gap="small">
            <Button
              type="primary"
              size="large"
              block
              icon={<CreditCardOutlined />}
              disabled={!cartStore.count || order.isLoading || cartStore.totalMinusCoupons <= 0}
              onClick={() => navigate(routes.CHECKOUT)}
            >
              Pay Card
            </Button>
            <Button
              type="default"
              size="large"
              block
              icon={<DollarOutlined />}
              disabled={!cartStore.count || cartStore.totalMinusCoupons <= 0}
              onClick={() => order.mutate()}
              loading={order.isLoading}
            >
              Pay Cash
            </Button>
          </Flex>
        </>
      )}
      {contextHolder}
    </>
  );

  function renderHeader() {
    return (
      <Row align="middle" justify="space-between">
        <Typography.Text strong style={{ fontSize: 20 }}><ShoppingCartOutlined /> Cart</Typography.Text>
        <Button
          onClick={() => cartStore.clear()}
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
      <>
        <PromoCode />
        <Row align="top" justify="space-between">
          <Col>
            <Typography.Text strong>Total count: <span style={{ color: '#1677ff' }}>{cartStore.count}</span></Typography.Text>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Row>
              {renderTotalLine('Subtotal', cartStore.subtotal)}
              {cartStore.isDiscount && renderTotalLine('Discount', cartStore.discount, true)}
              {cartStore.isCoupons && renderTotalLine('Coupons', cartStore.couponsTotal, true)}
              {renderTotalLine('Total', cartStore.totalMinusCoupons)}
            </Row>
          </Col>
        </Row>
      </>
    );
  }

  function renderTotalLine(title: string, amount: number, minus: boolean = false) {
    return (
      <>
        <Col span={12}>{title}:</Col>
        <Col span={12}><Typography.Link strong>{minus && '-'}${amount}</Typography.Link></Col>
      </>
    );
  }
});