import React, { createContext, useContext, useEffect } from 'react';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import AppRouter from './router/AppRouter';
import { WorkerContext } from './context/WorkerContext';
import useSetupWorker from './hooks/useSetupworker';

function App() {
  const { worker, routes, routeStopMap } = useSetupWorker();

  console.log('app loaded');

  useEffect(() => {
    console.log('routes changed [app.tsx]', routes);
  }, [routes]);

  return (
    <WorkerContext.Provider value={{ 
      worker,
      data: { routes, routeStopMap }
    }}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </WorkerContext.Provider>
  );
}

export default App;
