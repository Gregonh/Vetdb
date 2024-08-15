import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout } from '../Layouts/MainLayout';
import { ChangePassword } from '../pages/ChangePassword';
import { ConfirmEmail } from '../pages/ConfirmEmail';
import { ErrorPage } from '../pages/ErrorPage';
import { Home } from '../pages/Home';
import { LoginUser } from '../pages/LoginUser';
import { RegisterUser } from '../pages/RegisterUser';
import { ProfilerComponent } from '../utils/ProfilerComponent';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
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
        errorElement: <ErrorPage />,
      },
      {
        path: '/login',
        element: <LoginUser />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/confirmEmail/:id',
        element: <ConfirmEmail />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/changePassword/:id',
        element: <ChangePassword />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
