import {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [r, setR] = useState(null);

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(r => setR(r));
  }, []);

  useEffect(() => {
    console.log(r);
  }, [r]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
