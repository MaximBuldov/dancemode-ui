import {
  CreditCardOutlined,
  DeleteOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Flex, Row, Typography } from 'antd';
import { CartItem, Price, PromoCode, SuccessPage } from 'components';
import { useCreateOrder } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IKeys, IPaymentMethod } from 'models';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as routes from 'routes/consts';
import { bundleService } from 'services';
import { cartStore } from 'stores';

export const Cart = observer(() => {
  const navigate = useNavigate();
  const bundles = useQuery({
    queryKey: [IKeys.BUNDELS],
    queryFn: () =>
      bundleService.getProductsWithPrice(cartStore.data.map((el) => el.id))
  });

  const result = useMemo(
    () =>
      bundles.data?.reduce(
        (acc, bundle) => {
          const res = bundle.products?.reduce(
            (acc, product) => {
              acc.total += product?.sale_price || product.price;
              acc.subtotal += product.price;
              return acc;
            },
            { subtotal: 0, total: 0 }
          );

          acc.subtotal += res.subtotal;
          acc.total += res.total;

          return acc;
        },
        { subtotal: 0, total: 0 }
      ),
    [bundles.data]
  );
  const totalMinusCoupons = useMemo(
    () => (result?.total || 0) - cartStore.couponsTotal,
    [result?.total]
  );
  const isTotalZero = totalMinusCoupons === 0;
  const order = useCreateOrder({
    onSuccess: () => cartStore.clear(),
    payment_method: isTotalZero ? IPaymentMethod.COUPON : IPaymentMethod.CASH
  });

  return (
    <>
      {order.isSuccess ? (
        <SuccessPage order={order.data} />
      ) : (
        <Flex orientation="vertical" gap="middle">
          <Flex align="center" justify="space-between">
            <b style={{ fontSize: 16 }}>🛒 Cart</b>
            <Button
              onClick={() => {
                cartStore.clear();
                bundles.refetch();
              }}
              danger
              type="text"
              icon={<DeleteOutlined />}
            >
              Clear cart
            </Button>
          </Flex>
          {bundles.data?.map((bundle, i) => {
            const { total, subtotal } = bundle.products.reduce(
              (acc, el) => {
                acc.subtotal += el.price;
                acc.total += el.sale_price || 0;
                return acc;
              },
              {
                total: 0,
                subtotal: 0
              }
            );
            return (
              <Card
                key={bundle.id}
                type="inner"
                title={bundle.id === -1 ? 'Classes' : `Package #${i + 1}`}
                size="small"
                extra={<Price total={total} subtotal={subtotal} />}
              >
                {bundle.products.map((el) => (
                  <CartItem item={el} />
                ))}
              </Card>
            );
          })}
          <div>
            <PromoCode />
            <Row align="top" justify="space-between">
              <Col>
                <Typography.Text strong>
                  Total count:{' '}
                  <span style={{ color: '#1677ff' }}>{cartStore.count}</span>
                </Typography.Text>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                {result && (
                  <Row>
                    {renderTotalLine('Subtotal', result.subtotal)}
                    {result.subtotal !== result.total &&
                      renderTotalLine(
                        'Discount',
                        result.subtotal - result.total,
                        true
                      )}
                    {cartStore.isCoupons &&
                      renderTotalLine('Coupons', cartStore.couponsTotal, true)}
                    {renderTotalLine('Total', result.total)}
                  </Row>
                )}
              </Col>
            </Row>
          </div>
          <Flex gap="small">
            <Button
              type="primary"
              size="large"
              block
              icon={<CreditCardOutlined />}
              disabled={
                !cartStore.count || order.isPending || totalMinusCoupons <= 0
              }
              onClick={() => {
                cartStore.setTotal(result?.total || 0);
                navigate(routes.CHECKOUT);
              }}
            >
              Pay Card
            </Button>
            <Button
              type="default"
              size="large"
              block
              icon={<DollarOutlined />}
              disabled={!cartStore.count || totalMinusCoupons < 0}
              onClick={() => order.mutate()}
              loading={order.isPending}
            >
              {isTotalZero ? 'Book class' : 'Pay Cash'}
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );

  function renderTotalLine(
    title: string,
    amount: number,
    minus: boolean = false
  ) {
    return (
      <>
        <Col span={12}>{title}:</Col>
        <Col span={12}>
          <Typography.Link strong>
            {minus && '-'}${amount}
          </Typography.Link>
        </Col>
      </>
    );
  }
});
