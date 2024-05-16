import './App.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import AccountBar from './components/accountbar';
import { home, SignUp, Contact, BmiCalculator, BmiTracker, BmiInformation, Bmitest, BmiAdults, BmiChildren } from './Pages/pageindex';
import "./css/general.css";
import logo512 from './devLogo.png'
import AVBA from './AvbaLogo.png'

export default function App() {

  return (
    <Router>
      <div className="App">
        {/* <div className="pageHead"><img src={logo512} alt="testimage" className="headerLogo" /><AccountBar/></div> */}
        <div className="pageHead">
            <Link to="/">
                <img src={AVBA} alt="testimage" className="headerLogo" />
            </Link>
            <AccountBar />
        </div>

        
        <Navbar />
        <Routes>
          <Route path="/" element={<home />}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/physical"></Route>
          <Route path="/mental"></Route>
          <Route path="/fitness"></Route>
          <Route path="/contact" element={<Contact/>}></Route>
          <Route path="/bmitest" element={<Bmitest/>}></Route>
          <Route path="/bmiAdults" element={<BmiAdults/>}></Route>
          <Route path="/bmiChildren" element={<BmiChildren/>}></Route>
          <Route path="/bmiCalc" element={<BmiCalculator/>}></Route>
          {/* <Route path="/bmiInformation" element={<BmiInformation />}>
            <Route path="bmiCalc" element={<BmiCalculator />} />
            <Route path="bmiTracker" element={<BmiTracker />} />
          </Route> */}
        </Routes>
      </div>
    </Router>
  );
}

//Hello World
