import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      console.log(data)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={apiCall}>Test API Call</button>
      </header>
    </div>
  );
}

export default App;
