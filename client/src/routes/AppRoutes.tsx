import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout } from '../Layouts/MainLayout';
import { ErrorPage } from '../pages/ErrorPage';
import { Home } from '../pages/Home';
import { UserVet } from '../pages/TestCreateUser';
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
    ],
  },
  {
    path: '/user',
    element: <UserVet />,
    errorElement: <ErrorPage />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
