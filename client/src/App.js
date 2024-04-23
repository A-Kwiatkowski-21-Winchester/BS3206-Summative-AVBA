import './App.css';
import {Route, Routes} from 'react-router-dom';
import CreateContent from './pages/MentalHealthContent/CreateContent';


function App() {

 

  return (
    <div>
    <Routes>
    
      <Route path="/mentalHealth" element={<CreateContent />}/>
    </Routes>
  </div>
  );
}

export default App;
