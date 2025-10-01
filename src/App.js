import './App.css';

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import DepartementsPage from "./pages/DepartementsPage";
import PageAccueil from "./pages/PageAccueil";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import DashboardPlateforme from "./pages/plateforme/Plateforme";



function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<DepartementsPage/>} />
        <Route path="/accueil" element={<PageAccueil/>} />
        <Route path="/connexion" element={<Connexion/>} />
        <Route path="/inscription" element={<Inscription/>} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie/>} />
        <Route path="/plateforme" element={<DashboardPlateforme/>} />
        
        
        
        
      </Routes>
    </Router>
  );
}

export default App;
