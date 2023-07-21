import { useMutation } from '@tanstack/react-query';
import { Button, Divider } from 'antd';
import { ProfileForm } from 'components';
import { useError } from 'hooks';
import { IUpdateUser } from 'models';
import { useNavigate } from 'react-router-dom';
import { userService } from 'services';
import { userStore } from 'stores';

export const Profile = () => {
  const { onErrorFn, contextHolder, messageApi } = useError();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: userService.update,
    onSuccess: (_, values) => {
      const { acf, password, confirm, ...data } = values.data;
      userStore.updateUser({ ...data, id: userStore.data!.id });
      messageApi.open({
        type: 'success',
        content: 'Information successfully updated 🥳'
      });
    },
    onError: onErrorFn
  });

  return (
    <>
      <ProfileForm
        title="Profile 👩"
        onSubmit={(values) => {
          const data: IUpdateUser = {
            ...values,
            acf: {
              instagram: values.instagram,
              billing_phone: values.billing_phone
            }
          };
          mutate({ data, id: userStore.data!.id });
        }}
        isLoading={isLoading}
        isLabels={true}
        submitButton="Update profile"
        initialValues={userStore.data}
        isRequired={false}
      />
      <Divider />
      <Button
        danger
        block
        onClick={() => {
          navigate('/');
          userStore.logout();
        }}
      >
        Log out
      </Button>
      {contextHolder}
    </>
  );
};