import { App } from 'antd';
import { AxiosError } from 'axios';
import { IResponseError } from 'models';
import { errorCatch } from 'utils';

export const useError = () => {
  const { message } = App.useApp();

  function onErrorFn(error: AxiosError<IResponseError>, text?: string) {
    const content = errorCatch(error);
    message.open({
      type: 'error',
      content: text || content
    });
  }

  return { onErrorFn };
};
