import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Footer content</p>
      </footer>
    </>
  );
};

export { MainLayout };
