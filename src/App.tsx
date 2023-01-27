import React, { createContext, useContext } from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import AppRouter from './router/AppRouter';
import { WorkerContext } from './context/WorkerContext';
import useSetupWorker from './hooks/useSetupworker';

function App() {
  const { worker } = useSetupWorker();

  console.log('app loaded');

  return (
    <WorkerContext.Provider value={{ worker }}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </WorkerContext.Provider>
  );
}

export default App;
