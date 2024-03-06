import { IStatus } from './order.model';

export interface IUserResponse {
  token: string;
  user: IRUser;
}

export interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  date_created: string;
  acf: {
    instagram: string;
    dob: string;
    billing_phone: string;
  }
}

export interface IRUser extends IUser {
  id: number;
  role: IUserRoles[];
}

export interface IUserWithStatus extends IRUser {
  status?: IStatus;
  paid: boolean;
}

export enum IUserRoles {
  ADMIN = 'administrator',
  CUSTOMER = 'customer'
}

export interface IRResetPassword {
  data: {
    status: number
  };
  message: string;
}

export interface IResetPassword {
  email: string;
  code?: string;
  password?: string;
}