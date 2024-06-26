import { useState } from 'react';

// eslint-disable-next-line import/no-unresolved
import { Button } from '@/components/ui/button';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <Button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-400 text-red-900"
        >
          count is {count}
        </Button>
      </div>
    </>
  );
}

export { Home };
