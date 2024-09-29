import { useAuth0 } from '@auth0/auth0-react';

import { Button } from '../ui/button';

interface LoginButtonProps {
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  className,
}: {
  className?: string | undefined;
}) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    //go to auth0 login page using the authorization params
    await loginWithRedirect({
      // after login, redirect to /callback and then to the /vet-menu
      appState: {
        returnTo: '/vet-menu',
      },
      authorizationParams: {
        prompt: 'login',
      },
    });
  };

  //return <button onClick={handleLogin}>Log In</button>;
  return (
    <Button onClick={handleLogin} className={className}>
      Login
    </Button>
  );
};
