export interface IUserResponse {
  token: string;
  user: IUser;
}

export interface IUser {
  email: string;
  first_name: string;
  id: string;
  instagram: string;
  last_name: string;
  billing_phone: string;
  role: IUserRoles[];
}

export enum IUserRoles {
  ADMIN = 'administrator',
  CUSTOMER = 'customer'
}