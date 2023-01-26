import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const w = new Worker(new URL('sqlite-worker.js?sqlite3.dir=jswasm', import.meta.url), {
    type: 'module',
  });

  w.onmessage = function ({ data }) {
    switch (data.type) {
      case 'log':
        // logHtml(data.payload.cssClass, ...data.payload.args);
        
        console.log(data.payload.cssClass, ...data.payload.args);
        break;
      default:
        // logHtml('error', 'Unhandled message:', data.type);

        console.error(data.payload.cssClass, ...data.payload.args);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
