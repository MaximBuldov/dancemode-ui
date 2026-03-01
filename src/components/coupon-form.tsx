import { useQuery } from '@tanstack/react-query';
import { Button, Form, FormInstance, Input, InputNumber, Spin } from 'antd';
import dayjs from 'dayjs';
import { ICoupon, IKeys } from 'models';
import { userService } from 'services';
import { generatePromoCode } from 'utils';

const { Item } = Form;

const style = { width: '100%' };

interface CouponFormProps {
  initialValues?: ICoupon;
  onFinish: (data: ICoupon) => void;
  isLoading: boolean;
  form: FormInstance<ICoupon>;
}

export const CouponForm = ({
  initialValues,
  onFinish,
  isLoading,
  form
}: CouponFormProps) => {
  const usersApi = useQuery({
    queryFn: () => userService.getCustomers({ all: true }),
    queryKey: [IKeys.CUSTOMERS]
  });

  return (
    <Form<ICoupon>
      form={form}
      onFinish={({ date_expires, ...rest }) => {
        onFinish({
          ...rest,
          date_expires: dayjs(date_expires).toDate()
        });
      }}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              date_expires: dayjs(initialValues?.date_expires).format(
                'YYYY-MM-DD'
              ),
              allowed_users: initialValues?.allowed_users?.map((el) => el.id),
              used_by: initialValues?.used_by?.map((el) => el.id)
            }
          : undefined
      }
      layout="inline"
    >
      {initialValues && (
        <Item<ICoupon> name="id" hidden>
          <Input />
        </Item>
      )}
      <Item<ICoupon>
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
      <Item<ICoupon>
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Please input amount!' }]}
      >
        <InputNumber prefix="$" controls={false} />
      </Item>
      <Item<ICoupon> name="allowed_users" label="Allowed users" style={style}>
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
      {initialValues && (
        <Item<ICoupon> name="used_by" label="Used by" style={style}>
          {usersApi.isPending ? (
            <Spin spinning />
          ) : (
            <select
              multiple
              onChange={(e) => {
                const users = Array.from(e.target.options)
                  .filter((el) => el.selected)
                  .map((el) => +el.value);
                form.setFieldValue('used_by', users);
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
      )}
      <Item<ICoupon>
        name="date_expires"
        label="Expiry date"
        rules={[{ required: true, message: 'Please input expiry date!' }]}
        style={style}
      >
        <Input type="date" min={dayjs().format('YYYY-MM-DD')} />
      </Item>
      <Item name="description" label="Note" style={style}>
        <Input />
      </Item>
      <Button type="primary" htmlType="submit" block loading={isLoading}>
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </Form>
  );
};
