import axios from 'axios';
import { redirect } from 'react-router-dom';
import { userStore } from 'stores';
import { secureLs } from 'utils';

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
  config.headers.authorization = `Bearer ${secureLs.get('token')}`;
  return config;
};

$api.interceptors.request.use(authInterceptor);
$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.code === 'jwt_auth_invalid_token') {
      userStore.logout();
      redirect('/');
    }
    return Promise.reject(error);
  }
);

//wc
const $wc = axios.create({ ...axiosInstance.defaults });
const wcInterceptor = (config: any) => {
  const creds = `${process.env.REACT_APP_WC_KEY}:${process.env.REACT_APP_WC_SECRET}`;
  config.headers.authorization = `Basic ${btoa(creds)}`;

  return config;
};
$wc.interceptors.request.use(wcInterceptor);

export { $api, $auth, $wc };
