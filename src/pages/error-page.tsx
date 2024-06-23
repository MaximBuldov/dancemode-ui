import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError
} from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError();
  const isError = isRouteErrorResponse(error);
  const navigate = useNavigate();
  return (
    <Result
      status={isError ? (error.status as ResultStatusType) : 'warning'}
      title={
        isError
          ? `${error.status} - ${error.statusText}`
          : 'There are some problems with your operation.'
      }
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Back Home
        </Button>
      }
    />
  );
};
