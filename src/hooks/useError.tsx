import { message } from 'antd';
import { AxiosError } from 'axios';
import { IResponseError } from 'models';

export const useError = () => {
  const [messageApi, contextHolder] = message.useMessage();

  function onErrorFn(error: AxiosError<IResponseError>, message?: string) {
    messageApi.open({
      type: 'error',
      content: message || (
        <div
          dangerouslySetInnerHTML={{
            __html: error.response?.data.message || error.message
          }}
        />
      )
    });
  }

  return { onErrorFn, contextHolder, messageApi };
};
