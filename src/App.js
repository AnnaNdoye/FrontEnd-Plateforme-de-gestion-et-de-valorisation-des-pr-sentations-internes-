import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

//import DepartementsPage from "./pages/DepartementsPage";
import PageAccueil from "./pages/PageAccueil";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import DashboardPlateforme from "./pages/plateforme/Plateforme";
import Dashboard from "./pages/plateforme/Dashboard";
import Barre from "./pages/plateforme/Barre";
import Recherche from "./pages/plateforme/Recherche";
import Calendrier from "./pages/plateforme/Calendrier";
import Notification from "./pages/plateforme/Notification";
import Profil from "./pages/plateforme/Profil";

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/connexion" />;
  };

  return(
    <Router>
      <Routes>
        <Route path="/" element={<PageAccueil/>} />
        <Route path="/accueil" element={<PageAccueil/>} />
        <Route path="/connexion" element={<Connexion/>} />
        <Route path="/inscription" element={<Inscription/>} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie/>} />
        <Route path="/plateforme" element={<ProtectedRoute><DashboardPlateforme/></ProtectedRoute>} />
        <Route path="/plateforme/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/plateforme/barre" element={<ProtectedRoute><Barre/></ProtectedRoute>} />
        <Route path="/plateforme/recherche" element={<ProtectedRoute><Recherche/></ProtectedRoute>} />
        <Route path="/plateforme/calendrier" element={<ProtectedRoute><Calendrier/></ProtectedRoute>} />
        <Route path="/plateforme/notification" element={<ProtectedRoute><Notification/></ProtectedRoute>} />
        <Route path="/plateforme/profil" element={<ProtectedRoute><Profil/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
