import { useAuth0 } from '@auth0/auth0-react';

import { Button } from '../ui/button';
//requires you to enable the Auth0 New Universal Login Experience
//auth0 dashboard > universal login section > new option


interface SignupButtonProps {
  className?: string; 
}

export const SignupButton: React.FC<SignupButtonProps> = ({
  className,
}: {
  className?: string | undefined;
}) => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    //go to auth0 sing up page using the authorization params
    await loginWithRedirect({
      appState: {
        returnTo: '/vet-menu',
      },
      authorizationParams: {
        prompt: 'login',
        screen_hint: 'signup',
      },
    });
  };

  //return <button onClick={handleSignUp}>Sign Up</button>;
  return (
    <Button variant="ghost" onClick={handleSignUp} className={className}>
      Register
    </Button>
  );
};
