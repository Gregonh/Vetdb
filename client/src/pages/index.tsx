import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from './Home.tsx';

// eslint-disable-next-line import/no-default-export
export default function Pages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}
