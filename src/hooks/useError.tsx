import { message } from 'antd';
import { AxiosError } from 'axios';
import { IResponseError } from 'models';

export const useError = () => {
  const [messageApi, contextHolder] = message.useMessage();

  function onErrorFn(error: AxiosError<IResponseError>) {
    // eslint-disable-next-line no-console
    console.log(error);
    messageApi.open({
      type: 'error',
      content: <div dangerouslySetInnerHTML={{ __html: error.response?.data.message || error.message }} />
    });
  }

  return { onErrorFn, contextHolder, messageApi };
};