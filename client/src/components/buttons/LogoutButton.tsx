import { useAuth0 } from '@auth0/auth0-react';

//redirects to the Auth0 /v2/logout endpoint to clear the Auth0 session
export const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  const handleLogout = async () => {
    //redirect your users after they log out to the Allowed Logout URLs
    await logout({
      logoutParams: {
        // to avoid different url for development and production
        returnTo: window.location.origin,
      },
    });
  };

  return <button onClick={handleLogout}>Log Out</button>;
};
