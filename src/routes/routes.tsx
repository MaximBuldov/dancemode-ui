import { Calendar, Cart, Classes, Coupons, ForgotPassword, Login, Orders, Payments, Profile, Registration, Students, Video } from 'pages';

import { CALENDAR, CART, CLASSES, COUPONS, FORGOT_PASSWORD, LOGIN, ORDERS, PAYMENTS, PROFILE, SIGN_UP, STUDENTS, VIDEO } from './consts';

interface IRoute {
  path: string;
  element: React.ReactNode;
}

export const adminRoutes: IRoute[] = [
  {
    path: ORDERS,
    element: <Orders />
  },
  {
    path: PROFILE,
    element: <Profile />
  },
  {
    path: STUDENTS,
    element: <Students />
  },
  {
    path: CALENDAR,
    element: <Calendar />
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
  },
  {
    path: COUPONS,
    element: <Coupons />
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

