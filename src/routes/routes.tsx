import { Cart, Classes, ForgotPassword, Home, Login, Payments, Profile, Registration, Video } from 'pages';

import { CART, CLASSES, FORGOT_PASSWORD, LOGIN, PAYMENTS, PROFILE, SIGN_UP, VIDEO } from './consts';

interface IRoute {
  path: string;
  element: React.ReactNode;
}

export const adminRoutes: IRoute[] = [
  {
    path: '/admin',
    element: <Home />
  }
];

export const userRoutes: IRoute[] = [
  {
    path: PROFILE,
    element: <Profile />
  },
  {
    path: CLASSES,
    element: <Classes />
  },
  {
    path: VIDEO,
    element: <Video />
  },
  {
    path: PAYMENTS,
    element: <Payments />
  },
  {
    path: CART,
    element: <Cart />
  }
];

export const publicRoutes: IRoute[] = [
  {
    path: LOGIN,
    element: <Login />
  },
  {
    path: SIGN_UP,
    element: <Registration />
  },
  {
    path: FORGOT_PASSWORD,
    element: <ForgotPassword />
  }
];

