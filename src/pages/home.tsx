import { observer } from 'mobx-react-lite';
import { userStore } from 'stores';

import { Calendar } from './calendar';
import { Classes } from './classes';
import { Login } from './login';

export const Home = observer(() => {
  const { isAuth, isAdmin } = userStore;
  return isAuth ? isAdmin ? <Calendar /> : <Classes /> : <Login />;
});
