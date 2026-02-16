import React, { useState } from 'react';
import Hero from './components/Hero';
import CommandCenter from './components/CommandCenter';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <>
      {/* 
        Simple conditional rendering to swap between the Hero intro 
        and the main dashboard 
      */}
      {!hasStarted ? (
        <Hero onEnter={() => setHasStarted(true)} />
      ) : (
        <CommandCenter />
      )}
    </>
  );
};

export default App;