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
    delta: 250
  });

  return (
    <div {...handlers} className="app-container">
      <RouterProvider router={router} />
    </div>
  );
});

export default App;

// TODO
// - add quantity change on edit product
// - add ability to delete class and check if someone buy it
// - add notification after reset password
// - add to product new array who bought it, and remove after cancle

