import { AxiosInstance } from 'axios';
import { IUserResponse, SecureStore } from 'models';
import { secureLs } from './secure-local-storage';

export const saveTokensStorage = async (
  accessToken: string,
  refreshToken: string
) => {
  secureLs.set(SecureStore.ACCESS_TOKEN, accessToken);
  secureLs.set(SecureStore.REFRESH_TOKEN, refreshToken);
};

export const deleteTokensStorage = () => {
  secureLs.remove(SecureStore.ACCESS_TOKEN);
  secureLs.remove(SecureStore.REFRESH_TOKEN);
};

export const getNewToken = async (auth: AxiosInstance) => {
  try {
    const res = await auth<IUserResponse>('/login/access-token', {
      data: { refreshToken: secureLs.get(SecureStore.REFRESH_TOKEN) }
    });

    if (res.data.accessToken)
      saveTokensStorage(res.data.accessToken, res.data.refreshToken);

    return res.data;
  } catch (error) {
    throw error;
  }
};
