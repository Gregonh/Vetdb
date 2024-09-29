import { useAuth0 } from '@auth0/auth0-react';

import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { SignupButton } from './SingupButton';

/*Check authorization and show one component or another
To avoid the jump when it is checking the isAuthenticated 
we must use isLoading in the parent component that contains 
this navbar buttons (in our case is the Main layout that contains the navbar),
so we show a loader and when isLoading ends or is false, then we have 
the final isAuthenticated value (avoiding the possible jump when 
isAuthenticated is being calculated).
*/
export const NavBarButtons: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="">
      {!isAuthenticated && (
        <>
          <SignupButton />
          <LoginButton />
        </>
      )}
      {isAuthenticated && (
        <>
          <LogoutButton />
        </>
      )}
    </div>
  );
};
