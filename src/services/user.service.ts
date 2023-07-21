import { ILoginForm, ISignupForm, IUpdateUser, IUserResponse } from 'models';

import { $api, $auth } from '../http';

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

  async update({ data, id }: { data: IUpdateUser, id: string }) {
    try {
      const res = await $api.post(`/wp/v2/users/${id}`, data);
      return res.data as IUserResponse;
    } catch (error) {
      throw error;
    }
  }
};

export const userService = new UserService();