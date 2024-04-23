import './App.css';
import {Route, Routes} from 'react-router-dom';
import CreateArticle from './pages/MentalHealthContent/CreateArticles/CreateArticle'
import ViewAllArticles from './pages/MentalHealthContent/ViewArticles/ViewAllArticles';


function App() {

 

  return (
    <div>
    <Routes>
    
      <Route path="/mentalHealth" element={<CreateArticle />}/>
      <Route path="/mentalHealthArticles" element={<ViewAllArticles />}/>
    </Routes>
  </div>
  );
}

export default App;
