import { useAuth0 } from '@auth0/auth0-react';

export const VetMenu: React.FC = () => {
  const { user } = useAuth0(); //to use user var this component must be protected with AuthenticationGuard

  if (!user) {
    return null;
  }

  return (
    <div role="alert">
      <p>Vet Menu</p>
    </div>
  );
};
