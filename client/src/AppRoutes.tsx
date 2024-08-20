import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { ErrorPage } from './components/errors/ErrorPage';
import {
  FallbackComponent,
  logErrorToService,
} from './components/errors/FallbackComponent';
import { MockError } from './components/errors/MockError';
import { ReactErrorBoundary } from './components/errors/ReactErrorBoundary';
import { MainLayout } from './components/layouts/MainLayout';
import { ChangePassword } from './components/pages/ChangePassword';
import { ConfirmEmail } from './components/pages/ConfirmEmail';
import { Home } from './components/pages/Home';
import { LoginUser } from './components/pages/LoginUser';
import { RegisterUser } from './components/pages/RegisterUser';
import { ProfilerComponent } from './utils/ProfilerComponent';

const ErrorBoundaryLayout = () => (
  <ReactErrorBoundary FallbackComponent={FallbackComponent} onError={logErrorToService}>
    <Outlet />
  </ReactErrorBoundary>
);

const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <ProfilerComponent id="Home">
                <Home />
              </ProfilerComponent>
            ),
          },
          {
            path: '/register',
            element: (
              <ReactErrorBoundary
                FallbackComponent={FallbackComponent}
                onError={logErrorToService}
              >
                <RegisterUser />
              </ReactErrorBoundary>
            ),
          },
          {
            path: '/login',
            element: <LoginUser />,
          },
          {
            path: '/confirmEmail/:id',
            element: <ConfirmEmail />,
          },
          {
            path: '/changePassword/:id',
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: '/mock',
        element: (
          <ReactErrorBoundary
            FallbackComponent={FallbackComponent}
            onError={logErrorToService}
          >
            <MockError />
          </ReactErrorBoundary>
        ),
      },
      // must be the last, to handle undefined route
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
