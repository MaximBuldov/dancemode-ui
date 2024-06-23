import {
  Calendar,
  Cart,
  Checkout,
  Classes,
  Coupons,
  CreateCoupon,
  ForgotPassword,
  Login,
  Orders,
  Payments,
  Profile,
  Registration,
  Reports,
  Students,
  Video
} from 'pages';

import {
  CALENDAR,
  CART,
  CHECKOUT,
  CLASSES,
  COUPONS,
  CREATE_COUPON,
  FORGOT_PASSWORD,
  LOGIN,
  ORDERS,
  PAYMENTS,
  PROFILE,
  REPORTS,
  SIGN_UP,
  STUDENTS,
  VIDEO
} from './consts';

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
  },
  {
    path: CREATE_COUPON,
    element: <CreateCoupon />
  },
  {
    path: REPORTS,
    element: <Reports />
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
  },
  {
    path: CHECKOUT,
    element: <Checkout />
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
