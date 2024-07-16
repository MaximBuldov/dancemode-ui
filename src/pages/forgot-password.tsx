import { UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Result, Typography } from 'antd';
import { ISendResetCode } from 'models';
import { userService } from 'services';

const { useForm, Item } = Form;

export const ForgotPassword = () => {
  const [form] = useForm<ISendResetCode>();

  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationFn: userService.sendCode
  });

  return isSuccess ? (
    <Result
      status="success"
      title={data.message}
      subTitle="Please check you email"
    />
  ) : (
    <>
      <Typography.Title level={4}>Forgot Password 🤔</Typography.Title>
      <Typography.Paragraph>
        Please enter your email address and we will send you link to reset
        password
      </Typography.Paragraph>
      <Form<ISendResetCode>
        form={form}
        name="login"
        onFinish={(data) => mutate(data)}
        size="large"
      >
        <Item<ISendResetCode>
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Your email" />
        </Item>
        <Button type="primary" htmlType="submit" block loading={isPending}>
          Submit
        </Button>
      </Form>
    </>
  );
};
