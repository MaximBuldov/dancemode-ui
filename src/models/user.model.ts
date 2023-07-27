export interface IUserResponse {
  token: string;
  user: IRUser;
}

export interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  acf: {
    instagram: string;
    dob: string;
    billing_phone: string;
  }
}

export interface IRUser extends IUser {
  id: string;
  role: IUserRoles[];
}

export enum IUserRoles {
  ADMIN = 'administrator',
  CUSTOMER = 'customer'
}