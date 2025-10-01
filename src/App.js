import './App.css';

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import DepartementsPage from "./pages/DepartementsPage";
import PageAccueil from "./pages/PageAccueil";



function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<DepartementsPage/>} />
        <Route path="/accueil" element={<PageAccueil/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
