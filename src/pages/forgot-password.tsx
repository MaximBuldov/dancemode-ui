import React from 'react';
import { FontColorsOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Typography } from 'antd';
import { useError } from 'hooks';
import { userService } from 'services';
import { IResetPassword } from 'models';
import { useNavigate } from 'react-router-dom';

const { useForm, Item } = Form;

export const ForgotPassword = () => {
  const [form] = useForm();
  const { messageApi, contextHolder } = useError();
  const navigate = useNavigate();

  const sendCode = useMutation({
    mutationFn: userService.sendCode,
    onSuccess: ({ data }) => {
      messageApi.info(data.message);
    }
  });

  const resetPassword = useMutation({
    mutationFn: userService.resetPassword,
    onSuccess: ({ data }) => {
      messageApi.info(data.message);
      navigate('/login');
    }
  });

  const sendForm = (data: IResetPassword) => {
    if (sendCode.isSuccess) {
      resetPassword.mutate(data);
    } else {
      sendCode.mutate(data);
    }
  };

  return (
    <>
      <Typography.Title level={4}>Forgot Password 🤔</Typography.Title>
      <Typography.Paragraph>
        {sendCode.isSuccess ?
          'Enter verification code from email and new password' :
          'Please enter your email address and we will send you link to reset password'}
      </Typography.Paragraph>
      <Form<IResetPassword>
        form={form}
        name="login"
        onFinish={(data) => sendForm(data)}
        size="large"
      >
        <Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Your email"
          />
        </Item>
        {sendCode.isSuccess && (
          <>
            <Item
              name="code"
              rules={[{ required: true, message: 'Please input verification code!' }]}
            >
              <Input
                prefix={<FontColorsOutlined />}
                placeholder="Verification code" />
            </Item>
            <Item
              name="password"
              hasFeedback
              rules={[{
                required: true,
                message: 'Please input your password!'
              },
              {
                min: 6,
                message: 'Minimum password length is 6 characters'
              }]}
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
                    return Promise.reject(new Error('The new password that you entered do not match!'));
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
        )}
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={sendCode.isPending || resetPassword.isPending}
        >
          Submit
        </Button>
      </Form>
      {contextHolder}
    </>
  );
};