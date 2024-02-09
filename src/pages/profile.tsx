import { useMutation } from '@tanstack/react-query';
import { Button, Divider } from 'antd';
import { ProfileForm } from 'components';
import { useError } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { userService } from 'services';
import { cartStore, userStore } from 'stores';

export const Profile = () => {
  const { onErrorFn, contextHolder, messageApi } = useError();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: userService.update,
    onSuccess: (_, values) => {
      const { password, confirm, ...data } = values;
      userStore.updateUser(data);
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
        onSubmit={mutate}
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
          cartStore.clear();
          userStore.logout();
        }}
      >
        Log out
      </Button>
      {contextHolder}
    </>
  );
};