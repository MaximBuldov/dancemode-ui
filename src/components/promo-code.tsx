import { CaretRightOutlined, DeleteTwoTone } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Row,
  Space,
  Tag,
  Typography,
  message
} from 'antd';
import { useState } from 'react';
import { couponService } from 'services';
import { cartStore, userStore } from 'stores';

export const PromoCode = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate, isPending } = useMutation({
    mutationFn: (code: string) => couponService.getMy({ code }),
    onSuccess: ({ data }) => {
      if (data.length) {
        const isValid = cartStore.checkCouponEligibility(
          userStore.data!.id,
          data[0]
        );
        if (isValid.success) {
          cartStore.addCoupon(data[0]);
        } else {
          messageApi.error(isValid.message);
          form.resetFields();
        }
      } else {
        messageApi.error('Coupon code is not valid');
      }
    },
    onSettled: () => form.resetFields()
  });

  return (
    <Space
      direction="vertical"
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
                messageApi.error('You already use this coupon');
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
        </>
      )}
      {contextHolder}
    </Space>
  );
};
