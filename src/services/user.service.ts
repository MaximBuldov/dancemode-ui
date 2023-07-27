import { ILoginForm, IRUser, ISignupForm, IUser, IUserResponse } from 'models';
import { userStore } from 'stores';

import { $api, $auth, $wc } from '../http';

class UserService {
  async login(data: ILoginForm) {
    try {
      const res = await $auth<IUserResponse>('/jwt-auth/v1/token', { data });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async signup(data: ISignupForm) {
    try {
      const res = await $auth('/custom/v1/register', { data });
      return res.data as IUserResponse;
    } catch (error) {
      throw error;
    }
  }

  async update(data: ISignupForm) {
    try {
      const res = await $api.post(`/wp/v2/users/${userStore.data?.id}`, data);
      return res.data as IUserResponse;
    } catch (error) {
      throw error;
    }
  }

  async getCustomers() {
    try {
      const res = await $wc.get('/wc/v3/customers');
      return res.data as IRUser[];
    } catch (error) {
      throw error;
    }
  }
};

export const userService = new UserService();