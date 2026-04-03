import { CaretRightOutlined, DeleteTwoTone } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Col,
  Flex,
  Form,
  Input,
  List,
  Row,
  Space,
  Tag,
  Typography
} from 'antd';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react-lite';
import { IKeys } from 'models';
import { useState } from 'react';
import { couponService } from 'services';
import { cartStore } from 'stores';

interface PromoCodeProps {
  cartTotal?: number;
}

export const PromoCode = observer(({ cartTotal = 0 }: PromoCodeProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const { data } = useQuery({
    queryFn: () => couponService.getMy(),
    queryKey: [IKeys.COUPONS],
    enabled: !!open
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (code: string) =>
      couponService.validate(code, cartStore.cartProductIds),
    onSuccess: (data) => {
      if (data.valid) {
        if (cartTotal - data.coupon.amount > 0) {
          cartStore.addCoupon(data.coupon);
        } else {
          message.error(
            'The coupon discount exceeds the total cart amount and cannot be applied.'
          );
        }
      } else {
        message.error(data.message);
        form.resetFields();
      }
    },
    onSettled: () => form.resetFields()
  });

  const availableCoupons =
    data?.filter((a) => !cartStore.coupons.some((b) => a.id === b.id)) || [];

  return (
    <Space
      orientation="vertical"
      style={{
        width: '100%',
        marginBottom: 16,
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        paddingBottom: 16
      }}
    >
      <Row onClick={() => setOpen((prev) => !prev)} justify="space-between">
        <Col>
          <Typography.Text strong>Promo Code</Typography.Text>
        </Col>
        <Col>
          <CaretRightOutlined rotate={open ? 90 : 0} />
        </Col>
      </Row>
      {open && (
        <>
          {cartStore.isCoupons && (
            <List
              dataSource={cartStore.coupons}
              renderItem={(el) => (
                <List.Item key={el.id}>
                  <Row justify="space-between" style={{ width: '100%' }}>
                    <Tag color="green">
                      {el.code.toUpperCase()}: ${el.amount} off
                    </Tag>
                    <DeleteTwoTone
                      onClick={() => cartStore.removeCoupon(el.id)}
                    />
                  </Row>
                </List.Item>
              )}
            />
          )}
          <Form<{ code: string }>
            onFinish={({ code }) => {
              if (cartStore.isCouponAdded(code)) {
                message.error('You already use this coupon');
                form.resetFields();
              } else {
                mutate(code);
              }
            }}
            form={form}
          >
            <Row justify="space-between" wrap={false} gutter={[16, 0]}>
              <Col style={{ width: '100%' }}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="code"
                  rules={[
                    { required: true, message: 'Please input Promo Code!' }
                  ]}
                >
                  <Input placeholder="Promo Code" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    loading={isPending}
                    type="primary"
                    ghost
                    htmlType="submit"
                  >
                    Apply
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {availableCoupons.length > 0 && (
            <Flex gap={8}>
              <div>Available coupons:</div>
              <Flex gap={8}>
                {availableCoupons.map((coupon) => (
                  <Tag
                    onClick={() => {
                      copy(coupon.code);
                      message.info('Copied!');
                    }}
                    color="cyan"
                  >
                    {coupon.code}
                  </Tag>
                ))}
              </Flex>
            </Flex>
          )}
        </>
      )}
    </Space>
  );
});
