import { useMutation } from '@tanstack/react-query';
import { Button, Divider } from 'antd';
import { ProfileForm } from 'components';
import { useAddToHomescreen, useError } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { userService } from 'services';
import { userStore } from 'stores';

export const Profile = () => {
  const { onErrorFn, contextHolder, messageApi } = useError();
  const [prompt, promptToInstall] = useAddToHomescreen();
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
      {prompt && (
        <Button
          block
          onClick={() => promptToInstall()}
        >
          Add to Home Screen
        </Button>
      )
      }
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