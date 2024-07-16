import { LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Typography } from 'antd';
import { IResetPassword } from 'models';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from 'services';
import { userStore } from 'stores';

const { useForm, Item } = Form;

export const ResetPassword = () => {
  const [form] = useForm<IResetPassword>();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { mutate, isPending } = useMutation({
    mutationFn: userService.resetPassword,
    onSuccess: (data) => {
      navigate('/');
      userStore.setUser(data);
    }
  });
  return (
    <>
      <Typography.Title level={4}>Enter new password</Typography.Title>
      <Typography.Paragraph>
        Please enter and confirm your new password below.
      </Typography.Paragraph>
      <Form<IResetPassword>
        form={form}
        name="login"
        onFinish={(data) => mutate(data)}
        size="large"
        initialValues={{ token }}
      >
        <>
          <Item<IResetPassword>
            name="token"
            hidden
            rules={[
              { required: true, message: 'Please input verification code!' }
            ]}
          >
            <Input />
          </Item>
          <Item<IResetPassword>
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              },
              {
                min: 6,
                message: 'Minimum password length is 6 characters'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New password"
            />
          </Item>
          <Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The new password that you entered do not match!')
                  );
                }
              })
            ]}
          >
            <Input.Password
              placeholder="Confirm password"
              prefix={<LockOutlined />}
            />
          </Item>
        </>
        <Button type="primary" htmlType="submit" block loading={isPending}>
          Submit
        </Button>
      </Form>
    </>
  );
};
