export const PageLoader: React.FC = () => {
  const loadingImg = 'https://cdn.auth0.com/blog/hello-auth0/loader.svg';

  return (
    <div className="root-container flex items-center justify-center">
      <div className="m-auto h-20 w-20 motion-safe:animate-spin">
        <img src={loadingImg} alt="Loading..." />
      </div>
    </div>
  );
};
