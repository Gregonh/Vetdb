import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout';

// to show something between the auth0 page and our component. It avoids the page jumping
export const CallbackPage: React.FC = () => {
  const { error } = useAuth0();
  //TODO: deal the error with showboundary
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>
          <p>
            <span>{error.message}</span>
          </p>
        </div>
        <Link
          className="font-secondary inline-block align-baseline text-sm text-[rgb(39,86,163)] hover:text-blue-800"
          to="/"
        >
          Return to Home!
        </Link>
      </div>
    );
  }

  //simulate the Main layout but without content inside main. Avoid to have a footer.
  return <MainLayout />;
};
