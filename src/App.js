import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

import DepartementsPage from "./pages/DepartementsPage";
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
import PresentationsPage from "./pages/plateforme/PresentationsPage";
import ChangerMotDePasse from "./pages/ChangerMotDePasse";

function App() {
		const isAuthenticated = () => {
				const token = localStorage.getItem('token');
				if (!token) return false;
				try {
						const payload = JSON.parse(atob(token.split('.')[1]));
						const currentTime = Date.now() / 1000;
						return payload.exp > currentTime;
				} catch (error) {
						console.error('Invalid token:', error);
						localStorage.removeItem('token');
						return false;
				}
		};

		const ProtectedRoute = ({ children }) => {
				return isAuthenticated() ? children : <Navigate to="/connexion" />;
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
								<Route path="/plateforme/presentations" element={<ProtectedRoute><PresentationsPage/></ProtectedRoute>} />
								<Route path="/plateforme/departements" element={<ProtectedRoute><DepartementsPage/></ProtectedRoute>} />
								<Route path="/changer-mot-de-passe" element={<ChangerMotDePasse/>} />
						</Routes>
				</Router>
		);
}

export default App;
