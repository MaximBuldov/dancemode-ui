import axios from 'axios';
import qs from 'qs';
import { secureLs } from 'utils';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
//api
const $api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: {
    serialize: (params: any) => qs.stringify(params)
  }
});
const authInterceptor = (config: any) => {
  config.headers.authorization = `Bearer ${secureLs.get('token')}`;
  return config;
};
$api.interceptors.request.use(authInterceptor);
//auth
const $auth = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});
//wc
const $wc = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});
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