import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import AccountBar from './components/accountbar';
import { home, SignUp, Contact } from './Pages/pageindex';
import "./css/general.css";
import logo512 from './devLogo.png'

export default function App() {

  return (
    <Router>
      <div className="App">
        <div className="pageHead"><img src={logo512} alt="testimage" className="headerLogo" /><AccountBar/></div>

        
        <Navbar />
        <Routes>
          <Route path="/" element={<home />}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/physical"></Route>
          <Route path="/mental"></Route>
          <Route path="/fitness"></Route>
          <Route path="/contact" element={<Contact/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

//Hello World
