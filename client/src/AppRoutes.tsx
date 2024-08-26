import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { ErrorPage } from './components/errors/ErrorPage';
import { FallbackComponent } from './components/errors/FallbackComponent';
import { MockError } from './components/errors/MockError';
import { MainLayout } from './components/layouts/MainLayout';
import { ChangePassword } from './components/pages/ChangePassword';
import { ConfirmEmail } from './components/pages/ConfirmEmail';
import { Home } from './components/pages/Home';
import { LoginUser } from './components/pages/LoginUser';
import { RegisterUser } from './components/pages/RegisterUser';
import { ProfilerComponent } from './utils/ProfilerComponent';

const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={FallbackComponent}>
    <Outlet />
  </ErrorBoundary>
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
            element: <RegisterUser />,
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
          <>
            <ErrorBoundary FallbackComponent={FallbackComponent}>
              <MockError />
            </ErrorBoundary>
          </>
        ),
      },
    ],
    // must be the last, to handle undefined route
    errorElement: <ErrorPage />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
