
import './App.css';
import {Route, Routes} from 'react-router-dom';
import CreateArticle from './pages/MentalHealthContent/CreateArticles/CreateArticle'
import ViewAllArticles from './pages/MentalHealthContent/ViewArticles/ViewAllArticles';

import "./App.css";
import axios from "axios";
import { Link } from "react-router-dom";

import Navbar from "./components/navbar";
import AccountBar from "./components/accountbar";
import {
    Home,
    SignUp,
    Contact,
    BmiCalculator,
    BmiTracker,
    BmiInformation,
    Bmitest,
    BmiAdults,
    BmiChildren,
    BookAppointments,
    ViewAppointments,
} from "./pages/pageindex";
import "./css/general.css";
import logo512 from "./devLogo.png";
import AVBA from "./AvbaLogo.png";


export default function App() {
    return (
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
                <Route path="/" element={<Home />}></Route>
                <Route path="/signup" element={<SignUp />}></Route>
                <Route path="/physical"></Route>
                <Route path="/mental"></Route>
                <Route path="/fitness"></Route>
                <Route path="/contact" element={<Contact />}></Route>
                <Route path="/bmitest" element={<Bmitest />}></Route>
                <Route path="/bmiAdults" element={<BmiAdults />}></Route>
                <Route path="/bmiChildren" element={<BmiChildren />}></Route>
                <Route path="/bookAppointments" element={<BookAppointments />}></Route>
                <Route path="/viewAppointments" element={<ViewAppointments />}></Route>
                <Route path="/mentalHealth" element={<CreateArticle />}></Route>
                <Route path="/mentalHealthArticles" element={<ViewAllArticles />}></Route>
            </Routes>
        </div>
    );
}

//Hello World
