import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { IRUser, IUser, IUserResponse, IUserRoles } from 'models';
import { saveTokensStorage } from 'utils';

class User {
  data: IRUser | null = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'user',
      properties: ['data'],
      storage: window.localStorage
    });
  }

  setUser(data: IUserResponse) {
    this.data = data.user;
    saveTokensStorage(data.accessToken, data.refreshToken);
  }

  updateUser(data: IUser) {
    this.data = { id: this.data!.id, role: this.data!.role, ...data };
  }

  logout() {
    localStorage.clear();
    this.data = null;
  }

  checkUserId(arr: number[]) {
    return arr.includes(Number(this.data?.id));
  }

  get isAdmin() {
    return this.data?.role === IUserRoles.ADMIN;
  }

  get isAuth() {
    return !!this.data;
  }

  get initials() {
    return `${this.data?.first_name[0]}${this.data?.last_name[0]}`;
  }
}

export const userStore = new User();
