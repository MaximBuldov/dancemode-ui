import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import { IKeys, catOptions } from 'models';
import { couponService, userService } from 'services';
import { generatePromoCode } from 'utils';

const { useForm, Item } = Form;

const style = { width: '100%' };

export const CreateCoupon = () => {
  const [form] = useForm();
  const { message } = App.useApp();

  const couponApi = useMutation({
    mutationFn: couponService.create,
    onSuccess: () => {
      form.resetFields();
      message.success('Coupon created');
    }
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
        onFinish={({ date_expires, ...rest }) => {
          couponApi.mutate({
            ...rest,
            date_expires: dayjs(date_expires).toDate()
          });
        }}
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
        >
          Generate
        </Button>
        <Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please input amount!' }]}
        >
          <InputNumber prefix="$" controls={false} />
        </Item>
        <Item name="allowed_users" label="Allowed users" style={style}>
          {usersApi.isPending ? (
            <Spin spinning />
          ) : (
            <select
              multiple
              onChange={(e) => {
                const users = Array.from(e.target.options)
                  .filter((el) => el.selected)
                  .map((el) => +el.value);
                form.setFieldValue('allowed_users', users);
              }}
            >
              {usersApi.data?.data.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.first_name} {el.last_name}
                </option>
              ))}
            </select>
          )}
        </Item>
        <Item
          name="date_expires"
          label="Expiry date"
          rules={[{ required: true, message: 'Please input expiry date!' }]}
          style={style}
        >
          <Input type="date" min={dayjs().format('YYYY-MM-DD')} />
        </Item>
        <Item name="exc_cat" style={style} label="Exclude categories">
          <Select options={catOptions} mode="multiple" />
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
        <Item name="description" label="Note" style={style}>
          <Input />
        </Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={couponApi.isPending}
        >
          Create
        </Button>
      </Form>
    </>
  );
};
