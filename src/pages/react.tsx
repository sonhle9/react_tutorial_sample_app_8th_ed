import React from 'react';
import logo from './logo.svg';
import '../App.css';

function App() {
  const REACT_VERSION = React.version;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
        React version: <code>{REACT_VERSION}</code>
        </p>
        <p>
        From the command line:
        </p>
        <p>
        <code>npm view react version</code>
        </p>
        <p>
        <code>npm view react-native version</code>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="App-link"
          href="https://reactnative.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Native
        </a>
      </header>
    </div>
  );
}

export default App;
