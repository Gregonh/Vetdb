import { Outlet, Link } from 'react-router-dom';

/*It´s better to have the footer outside this layout
to avoid the ui jump impression.*/
const MainLayout: React.FC = () => {
  return (
    <>
      <nav className="min-h-min-height-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <main className="mt-default-top-margin">
        {/* {isLoading ? <p>Loading ....</p> : <Outlet />} */}
        <Outlet />
      </main>
    </>
  );
};

export { MainLayout };
