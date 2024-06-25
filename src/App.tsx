import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useError } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IResponseError } from 'models';
import { ErrorPage, Home } from 'pages';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { userStore } from 'stores';

import { App as AppProvider } from 'antd';
import { Template } from './components';
import { adminRoutes, publicRoutes, userRoutes } from './routes';

const App = observer(() => {
  const { onErrorFn } = useError();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        onErrorFn(
          error as AxiosError<IResponseError>,
          query.meta?.errorMessage as string
        );
      }
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        onErrorFn(error as AxiosError<IResponseError>);
      }
    })
  });

  const routes = userStore.isAuth
    ? userStore.isAdmin
      ? adminRoutes
      : userRoutes
    : publicRoutes;
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
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <div {...handlers} className="app-container">
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
    </AppProvider>
  );
});

export default App;
