import { useSearchParams } from 'react-router-dom';

export const ClassConfirmation = () => {
  const [params] = useSearchParams();
  return (
    <>
      User {params.get('user')}
      Status {params.get('status')}
      Class {params.get('class')}
    </>
  );
};