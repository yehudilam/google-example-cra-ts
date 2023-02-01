import React from 'react';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import AppRouter from './router/AppRouter';
import { WorkerContext } from './context/WorkerContext';
import useSetupWorker from './hooks/useSetupworker';

function App() {
  const { worker, route, routes, routeStopMap } = useSetupWorker();

  return (
    <WorkerContext.Provider value={{ 
      worker,
      data: { route, routes, routeStopMap }
    }}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </WorkerContext.Provider>
  );
}

export default App;
