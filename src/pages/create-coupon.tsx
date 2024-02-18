import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { useError } from 'hooks';
import { IKeys, catOptions } from 'models';
import { couponService, userService } from 'services';
import { generatePromoCode } from 'utils';

const { useForm, Item } = Form;

const style = { width: '100%' };

export const CreateCoupon = () => {
  const [form] = useForm();
  const { contextHolder, messageApi, onErrorFn } = useError();
  const couponApi = useMutation({
    mutationFn: couponService.create,
    onSuccess: () => {
      form.resetFields();
      messageApi.success('Coupon created');
    },
    onError: onErrorFn
  });

  const usersApi = useQuery({
    queryFn: () => userService.getCustomers(),
    queryKey: [IKeys.CUSTOMERS]
  });

  return (
    <>
      <Typography.Title level={4}>Create coupon</Typography.Title>
      <Form
        form={form}
        onFinish={couponApi.mutate}
        layout="inline"
      >
        <Item
          name="code"
          label="Code"
          rules={[{ required: true, message: 'Please input code!' }]}
        >
          <Input />
        </Item>
        <Button
          type="primary"
          ghost
          onClick={() => form.setFieldValue('code', generatePromoCode())}
        >Generate</Button>
        <Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please input amount!' }]}
        >
          <Input type="number" prefix="$" />
        </Item>
        <Item name="allowed_users" label="Allowed users" style={style}>
          <Select
            options={usersApi.data?.data.map(el => ({ value: el.id, label: `${el.first_name} ${el.last_name}` }))}
            loading={usersApi.isLoading}
            mode="multiple"
          />
        </Item>
        <Item
          name="date_expires"
          label="Expiry date"
          rules={[{ required: true, message: 'Please input expiry date!' }]}
          style={style}
        >
          <Input type="date" min={dayjs().format('YYYY-MM-DD')} />
        </Item>
        <Item
          name="excluded_product_categories"
          style={style}
          label="Exclude categories"
        >
          <Select
            options={catOptions}
            mode="multiple"
          />
        </Item>
        <Item
          name="usage_limit"
          label="Usage limit"
          rules={[{ required: true, message: 'Please input limit!' }]}
        >
          <InputNumber />
        </Item>
        <Item
          name="usage_limit_per_user"
          label="Usage limit per user"
          rules={[{ required: true, message: 'Please input limit!' }]}
        >
          <InputNumber />
        </Item>
        <Item
          name="description"
          label="Note"
          style={style}
        >
          <Input />
        </Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={couponApi.isLoading}
        >
          Create
        </Button>
      </Form>
      {contextHolder}
    </>
  );
};