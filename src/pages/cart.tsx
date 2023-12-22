import { DeleteOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Typography } from 'antd';
import { CartItem, PromoCode } from 'components';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { cartStore } from 'stores';
import * as routes from 'routes/consts';

export const Cart = observer(() => {
  const navigate = useNavigate();

  return (
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
        onClick={() => navigate(routes.CHECKOUT)}
      >
        Checkout
      </Button>
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
              {renderTotalLine('Sale', cartStore.subtotal - cartStore.total, true)}
              {cartStore.isCoupons && renderTotalLine('Coupons', cartStore.couponsTotal, true)}
              {renderTotalLine('Total', cartStore.total - cartStore.couponsTotal)}
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