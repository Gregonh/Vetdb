import { useAuth0 } from '@auth0/auth0-react';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { Auth0ProviderWithNavigate } from './Auth0Provider_Navigate';
import { AuthenticationGuard } from './components/auth0/AuthenticationGuard';
import { CallbackPage } from './components/auth0/CallbackPage';
import { PageLoader } from './components/auth0/PageLoader';
import { ErrorPage } from './components/errors/ErrorPage';
import { FallbackComponent } from './components/errors/FallbackComponent';
import { MockError } from './components/errors/MockError';
import { FooterLayout } from './components/layouts/FooterLayout';
import { MainLayout } from './components/layouts/MainLayout';
import { Home } from './components/pages/Home';
import { ChangePassword } from './components/pages/oldApproach/ChangePassword';
import { ConfirmEmail } from './components/pages/oldApproach/ConfirmEmail';
import { LoginUser } from './components/pages/oldApproach/LoginUser';
import { RegisterUser } from './components/pages/oldApproach/RegisterUser';
import { VetMenu } from './components/pages/VetMenu';
import { ProfilerComponent } from './utils/ProfilerComponent';

// auth0 provider must be between browser router and the rest of the routes.
const AuthoProviderLayout = () => {
  return (
    <Auth0ProviderWithNavigate>
      <Outlet />
    </Auth0ProviderWithNavigate>
  );
};
/*
Include the loader visual indicator related with auth0  for all the pages,
and avoid the ui jump when there is a isAuthenticated
var in the inner outlet component.
So generally isAuthenticated needs to be wrapper inside a isLoading,
to know the final result.
*/
const AppLayout = () => {
  const { isLoading, error } = useAuth0();
  if (error) {
    console.error('Auth0 Error:', error);
  }

  if (isLoading) {
    console.log(isLoading);

    return <PageLoader />;
  }

  return <Outlet />;
};

const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={FallbackComponent}>
    <Outlet />
  </ErrorBoundary>
);

const MainLayoutWithFooter = () => (
  <>
    <MainLayout />
    <FooterLayout />
  </>
);

//todo: add a fallbackElement in router provider as visual loader related with react router result
//todo: add another ErrorBoundary for possible Auth0Provider errors?
const router = createBrowserRouter([
  {
    element: <AuthoProviderLayout />,
    children: [
      {
        element: <ErrorBoundaryLayout />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/',
                element: <MainLayoutWithFooter />,
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
                  {
                    path: '/vet-menu',
                    element: <AuthenticationGuard component={VetMenu} />,
                  },
                ],
              },
              {
                path: '/callback',
                element: <CallbackPage />,
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
              {
                path: '/loa',
                element: <PageLoader />,
              },
            ],
            // must be the last, to handle undefined route
            errorElement: (
              <>
                <ErrorPage />
                <FooterLayout />
              </>
            ),
          },
        ],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
