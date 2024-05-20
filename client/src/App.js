
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import AccountBar from './components/accountbar';
import { Home, SignUp, Contact,BmiChildren,BmiAdults,Bmitest,BookAppointments,ViewAppointments,CreateArticle,ViewAllArticles } from './pages/pageindex';
import "./css/general.css";
import logo512 from './AvbaLogo_crop.png'

axios.defaults.withCredentials = true;

export default function App() {

  return (
    <Router>
      <div className="App">
        <div className="pageHead"><img src={logo512} alt="testimage" className="headerLogo" /><AccountBar/></div>

        
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          
          <Route path="/bmitest" element={<Bmitest/>}></Route>
          <Route path="/bmiAdults" element={<BmiAdults/>}></Route>
          <Route path="/bmiChildren" element={<BmiChildren/>}></Route>

          <Route path="/bookAppointments" element={<BookAppointments/>}></Route>
          <Route path="/viewAppointments" element={<ViewAppointments/>}></Route>
          
          <Route path="/mentalView" element={<ViewAllArticles/>}></Route>
          <Route path="/mentalCreate" element={<CreateArticle/>}></Route>
          <Route path="/contact" element={<Contact/>}></Route>
        </Routes>
      </div>
    </Router>
  )
}

//Hello World
