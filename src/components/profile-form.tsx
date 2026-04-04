import {
  InstagramOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Flex, Form, Typography } from 'antd';
import dayjs from 'dayjs';
import { ISignupForm, IUser } from 'models';
import { AddonInput, BirthdayPicker } from './ui';

interface ProfileFormProps {
  title: string;
  onSubmit: (data: ISignupForm) => void;
  isPending: boolean;
  submitButton: string;
  initialValues: IUser | null;
  isRequired: boolean;
}

const { useForm, Item } = Form;

export const ProfileForm = ({
  title,
  onSubmit,
  isPending,
  submitButton,
  initialValues,
  isRequired
}: ProfileFormProps) => {
  const [form] = useForm<ISignupForm>();

  return (
    <>
      <Typography.Title level={4}>{title}</Typography.Title>
      <Form<ISignupForm>
        form={form}
        name="signup"
        onFinish={onSubmit}
        layout="vertical"
        initialValues={
          initialValues
            ? {
                ...initialValues,
                dob: dayjs(initialValues.dob).format('YYYY-MM-DD')
              }
            : undefined
        }
      >
        <Flex gap={16} orientation="vertical">
          <AddonInput
            prefix={<UserOutlined />}
            addon="First Name"
            name="first_name"
            rules={[
              { required: isRequired, message: 'Please input your first name!' }
            ]}
          />
          <AddonInput
            name="last_name"
            rules={[
              { required: isRequired, message: 'Please input your last name!' }
            ]}
            prefix={<UserOutlined />}
            addon="Last Name"
          />
          <BirthdayPicker
            name="dob"
            rules={[
              {
                required: isRequired,
                message: 'Please input your date of birthday!'
              }
            ]}
          />
          <AddonInput
            name="email"
            rules={[
              { required: isRequired, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
            prefix={<MailOutlined />}
            addon="Email"
          />
          <AddonInput
            name="billing_phone"
            rules={[
              { required: isRequired, message: 'Please input your phone!' },
              {
                min: 10,
                message: 'Please enter correct phone number'
              }
            ]}
            prefix={<PhoneOutlined />}
            addon="Phone"
          />
          <AddonInput
            name="instagram"
            rules={[
              { required: isRequired, message: 'Please input your instagram!' }
            ]}
            prefix={<InstagramOutlined />}
            addon="Instagram"
          />
          <AddonInput
            prefix={<LockOutlined />}
            addon="Password"
            password={true}
            name="password"
            hasFeedback
            rules={[
              {
                required: isRequired,
                message: 'Please input your password!'
              },
              {
                min: 6,
                message: 'Minimum password length is 6 characters'
              }
            ]}
          />
          <AddonInput
            prefix={<LockOutlined />}
            addon="Confirm Password"
            password={true}
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: isRequired,
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
          />
          <Button type="primary" htmlType="submit" block loading={isPending}>
            {submitButton}
          </Button>
        </Flex>
      </Form>
    </>
  );
};
