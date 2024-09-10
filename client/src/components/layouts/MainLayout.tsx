import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
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
        <Outlet />
      </main>
      <footer className="mt-footer-top-margin">
        <p>Footer content</p>
      </footer>
    </>
  );
};

export { MainLayout };
