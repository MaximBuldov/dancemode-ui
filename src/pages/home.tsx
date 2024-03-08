import React from 'react';
import { userStore } from 'stores';
import { observer } from 'mobx-react-lite';

import { Login } from './login';
import { Classes } from './classes';
import { Calendar } from './calendar';

export const Home = observer(() => {
  const { isAuth, isAdmin } = userStore;
  return isAuth ?
    isAdmin ? <Calendar /> : <Classes />
    : <Login />;
});