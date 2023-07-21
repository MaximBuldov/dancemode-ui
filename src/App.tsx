import { observer } from 'mobx-react-lite';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { userStore } from 'stores';
import { ErrorPage, Home } from 'pages';

import { publicRoutes, userRoutes } from './routes';
import { Template } from './components';

const App = observer(() => {
  const routes = userStore.data ? userRoutes : publicRoutes;
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

  return (
    <RouterProvider router={router} />
  );
});

export default App;
