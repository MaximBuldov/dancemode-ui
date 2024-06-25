import { useMutation } from '@tanstack/react-query';
import { App, Button, Divider } from 'antd';
import { ProfileForm } from 'components';
import { useNavigate } from 'react-router-dom';
import { userService } from 'services';
import { cartStore, userStore } from 'stores';

export const Profile = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: userService.update,
    onSuccess: (_, values) => {
      const { password, confirm, ...data } = values;
      userStore.updateUser(data);
      message.open({
        type: 'success',
        content: 'Information successfully updated 🥳'
      });
    }
  });

  return (
    <>
      <ProfileForm
        title="Profile 👩"
        onSubmit={mutate}
        isPending={isPending}
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
    </>
  );
};
