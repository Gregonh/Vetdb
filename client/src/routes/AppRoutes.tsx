import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout } from '../Layouts/MainLayout';
import { ErrorPage } from '../pages/ErrorPage';
import { Home } from '../pages/Home';
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
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
