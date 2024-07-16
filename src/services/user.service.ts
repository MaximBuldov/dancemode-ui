import {
  ILoginForm,
  IRUser,
  IResetPassword,
  ISendResetCode,
  ISignupForm,
  IUserResponse
} from 'models';

import { $api, $auth } from '../http';

class UserService {
  async login(data: ILoginForm) {
    try {
      const res = await $auth<IUserResponse>('/auth/login', { data });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async signup(data: ISignupForm) {
    try {
      const res = await $auth('/auth/register', { data });
      return res.data as IUserResponse;
    } catch (error) {
      throw error;
    }
  }

  async update(data: ISignupForm) {
    try {
      const res = await $api.patch('/users', data);
      return res.data as IUserResponse;
    } catch (error) {
      throw error;
    }
  }

  async getCustomers(params?: any) {
    try {
      const res = await $api.get<IRUser[]>('/users', { params });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async sendCode(data: ISendResetCode) {
    try {
      const res = await $auth<{ message: string }>('/auth/reset-password', {
        data
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(data: IResetPassword) {
    try {
      const res = await $auth<IUserResponse>('/auth/set-password', {
        data
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
