import { withAuthenticationRequired } from '@auth0/auth0-react';
import { ComponentType } from 'react';

import { PageLoader } from './PageLoader';

interface AuthenticationGuardProps {
  component: ComponentType;
}
/**
 * A wrapper component that uses withAuthenticationRequired to
 * make it reusable for the components that you need to protect.
 * So with all the protected route components we need this wrapper.
 * If the user try to access manually to a route, it shows a loader
 * and checks if the user is authenticated, if not, it redirects to the login page.
 */
export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    //if we are not logged in, renders a component loader while redirects the user to the login
    onRedirecting: () => (
      <div className="page-layout">
        <PageLoader />
      </div>
    ),
  });

  return <Component />;
};
