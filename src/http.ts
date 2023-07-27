import axios from 'axios';
import { userStore } from 'stores';
import { secureLs } from 'utils';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: process.env.REACT_APP_API_URL
});

axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response && error.response.data && error.response.data.code === 'jwt_auth_valid_token') {
      userStore.logout();
    }
    return Promise.reject(error);
  }
);

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

//wc
const $wc = axios.create({ ...axiosInstance.defaults });;
const wcInterceptor = (config: any) => {
  const creds = `${process.env.REACT_APP_WC_KEY}:${process.env.REACT_APP_WC_SECRET}`;
  config.headers.authorization = `Basic ${btoa(creds)}`;

  return config;
};
$wc.interceptors.request.use(wcInterceptor);

export {
  $api,
  $auth,
  $wc
};