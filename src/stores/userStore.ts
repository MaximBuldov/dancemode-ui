import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { IUser, IUserResponse, IUserRoles } from 'models';
import { secureLs } from 'utils';

class User {
  data: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: 'user', properties: ['data'], storage: window.localStorage });
  }

  setUser(data: IUserResponse) {
    this.data = data.user;
    secureLs.set('token', data.token);
  }

  updateUser(data: IUser) {
    this.data = data;
  }

  logout() {
    localStorage.clear();
    this.data = null;
  }

  get isAdmin() {
    return this.data?.role.includes(IUserRoles.ADMIN);
  }

  get isAuth() {
    return !!this.data;
  }

  get initials() {
    return `${this.data?.first_name[0]}${this.data?.last_name[0]}`;
  }
}

export const userStore = new User();