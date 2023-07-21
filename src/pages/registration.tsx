import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userService } from 'services';
import { userStore } from 'stores';
import { ProfileForm } from 'components';
import { useError } from 'hooks';

export const Registration = () => {
  const { onErrorFn, contextHolder } = useError();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: userService.signup,
    onSuccess: (data) => {
      navigate('/');
      userStore.setUser(data);
    },
    onError: onErrorFn
  });

  return (
    <>
      <ProfileForm
        title="Welcome to Dance Mode 🫶"
        onSubmit={mutate}
        isLoading={isLoading}
        isLabels={false}
        submitButton="Signup"
        initialValues={null}
        isRequired={true}
      />
      {contextHolder}
    </>
  );
};