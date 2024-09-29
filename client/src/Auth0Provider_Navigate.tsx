import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate = ({
  children,
}: PropsWithChildren<Auth0ProviderWithNavigateProps>): JSX.Element | null => {
  const navigate = useNavigate(); //hook to get the history object, take users back to the route they intended to access

  const domain = import.meta.env['VITE_DOMAIN'];
  const clientId = import.meta.env['VITE_CLIENT_ID'];
  const redirectUri = import.meta.env['VITE_CALLBACK_URL'];
  //from the Auth0 Universal Login page to your React application.
  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId && redirectUri)) {
    console.error('Missing Auth0 configuration');
    return null;
  }
  /*configure the Auth0Provider to use the Auth0 Domain and Client ID.
  
  authorizationParams: with an object to define the query parameters that 
  will be sent during the call to the Auth0 /authorize endpoint.
  the redirect_uri, which is the URL where Auth0 will redirect your users back to your React application.
  En otro tuto salía esto para el provider: redirectUri={window.location.origin}
  */
  return (
    <>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
        }}
        onRedirectCallback={onRedirectCallback}
      >
        {children}
      </Auth0Provider>
    </>
  );
};
