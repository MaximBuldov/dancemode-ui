import React from 'react';
import { userStore } from 'stores';
import { observer } from 'mobx-react-lite';

import { Login } from './login';
import { Profile } from './profile';
import { Classes } from './classes';

export const Home = observer(() => {
  const { isAuth, isAdmin } = userStore;
  if (!isAuth) {
    return <Login />;
  } else {
    return isAdmin ? <Profile /> : <Classes />;
  }
});