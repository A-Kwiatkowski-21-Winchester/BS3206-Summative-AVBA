import './App.css';
import {Route, Routes} from 'react-router-dom';
import BookAppointments from './pages/GpAppointments/BookingSystem/BookAppointments';
import ViewAppointments from './pages/GpAppointments/ViewAppointments/ViewAppointments';
import Home from './pages/Home';


function App() {
 
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/bookAppointments" element={<BookAppointments />}/>
        <Route path="/viewAppointments" element={<ViewAppointments />}/>
      </Routes>
    </div>
  );
}

export default App;
