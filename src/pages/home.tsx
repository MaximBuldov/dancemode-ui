import React from 'react';
import { userStore } from 'stores';
import { observer } from 'mobx-react-lite';

import { Login } from './login';
import { Classes } from './classes';

export const Home = observer(() => {
  const { isAuth } = userStore;
  return isAuth ? <Classes /> : <Login />;
});