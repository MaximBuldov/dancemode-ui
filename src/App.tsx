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
// - after cancel class by user, out available spot for others(return back quantity o products +1)
// - messages, email, telegram
// - add quantity change on edit product
// - after cancel class by jane, whats going on?
// - can we update meta_data in order after payment?
// - forgot password
// - check makeups, admin also have makeups?
