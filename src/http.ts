import axios from 'axios';
import { deleteTokensStorage, errorCatch, getNewToken, secureLs } from 'utils';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: process.env.REACT_APP_API_URL
});

//auth
const $auth = axios.create({
  ...axiosInstance.defaults,
  method: 'POST'
});

//api
const $api = axios.create({ ...axiosInstance.defaults });
const authInterceptor = (config: any) => {
  const accessToken = secureLs.get('accessToken');
  if (config.headers && accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

$api.interceptors.request.use(authInterceptor);
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 ||
        errorCatch(error) === 'jwt expired' ||
        errorCatch(error) === 'jwt must be provided') &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await getNewToken($auth);
        return $api.request(originalRequest);
      } catch (error) {
        if (errorCatch(error) === 'jwt expired') deleteTokensStorage();
      }
    }

    throw error;
  }
);

export { $api, $auth };

