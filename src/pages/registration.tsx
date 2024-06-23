import { useMutation } from '@tanstack/react-query';
import { ProfileForm } from 'components';
import { useNavigate } from 'react-router-dom';
import { userService } from 'services';
import { userStore } from 'stores';

export const Registration = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: userService.signup,
    onSuccess: (data) => {
      navigate('/');
      userStore.setUser(data);
    }
  });

  return (
    <>
      <ProfileForm
        title="Welcome to Dance Mode 🫶"
        onSubmit={mutate}
        isPending={isPending}
        isLabels={false}
        submitButton="Signup"
        initialValues={null}
        isRequired={true}
      />
    </>
  );
};
