import React from 'react';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import AppRouter from './router/AppRouter';
import { WorkerProvider } from './context/WorkerContext';
// import useSetupWorker from './hooks/useSetupworker';

function App() {
  return (
    <WorkerProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </WorkerProvider>
  );
}

export default App;
