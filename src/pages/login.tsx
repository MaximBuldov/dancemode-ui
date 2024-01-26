import { Button, Divider, Form, Input, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { userService } from 'services';
import { userStore } from 'stores';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { useError } from 'hooks';

const { useForm, Item } = Form;

export const Login = observer(() => {
  const [form] = useForm();
  const { onErrorFn, contextHolder } = useError();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: userService.login,
    onSuccess: (data) => {
      navigate('/');
      userStore.setUser(data);
    },
    onError: onErrorFn
  });

  return (
    <div>
      <Typography.Title level={4}>Hey, please login 👋</Typography.Title>
      <Form
        form={form}
        name="login"
        onFinish={(data) => mutate(data)}
        size="large"
      >
        <Item
          name="username"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Your email"
          />
        </Item>
        <Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
        >
          Login
        </Button>
      </Form>
      <Divider />
      <Typography.Paragraph>If you don't have account please <Link to="/sign-up">signup</Link></Typography.Paragraph>
      {contextHolder}
    </div>
  );
});