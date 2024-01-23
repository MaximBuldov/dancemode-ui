import { observer } from 'mobx-react-lite';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { userStore } from 'stores';
import { ErrorPage, Home } from 'pages';
import { useSwipeable } from 'react-swipeable';

import { adminRoutes, publicRoutes, userRoutes } from './routes';
import { Template } from './components';

const App = observer(() => {

  const routes = userStore.isAuth ?
    userStore.isAdmin ? adminRoutes : userRoutes :
    publicRoutes;
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Template />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        ...routes
      ]
    }
  ]);
  const handlers = useSwipeable({
    onSwipedDown: () => window.location.reload(),
    delta: 150
  });

  return (
    <div {...handlers}>
      <RouterProvider router={router} />
    </div>
  );
});

export default App;

// TODO
// - messages, email, telegram
// - add quantity change on edit product
// - forgot password
// - add ability to delete class and check if someone buy it
// - add additional question on all delete and cancel actions
// - all error and success mesages
