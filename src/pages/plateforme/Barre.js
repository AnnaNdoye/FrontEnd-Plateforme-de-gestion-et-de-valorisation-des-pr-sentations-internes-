import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaLeaf, FaUser, FaBell, FaSignOutAlt, FaCalendar } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const Container = styled.div`
    display: flex;
    height: 100%;
    background-color: #f8f9fa;
`;

const Sidebar = styled.div`
    width: 280px;
    min-width: 280px;
    background: linear-gradient(135deg, #e59847ff, #ffac13ff, #ffc013bf);
    color: white;
    padding: 2rem 1.5rem;
    box-shadow: 5px 0 25px rgba(0,0,0,0.15);
    height: 100vh;
    overflow-y: auto;
    position: relative;
    z-index: 10;

  /* Style de la barre de défilement */
    &::-webkit-scrollbar {
    width: 6px;
    }

    &::-webkit-scrollbar-thumb {
    background: #ffffff55;
    border-radius: 3px;
    }

    &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 20%, rgba(255, 215, 0, 0.2) 50%, transparent 80%);
    background-size: 200% 200%;
    animation: ${shimmer} 10s linear infinite;
    z-index: -1;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: sticky;
    top: 0;
    background: linear-gradient(135deg, #FF8113, #FF5E13);
    z-index: 1;

    svg {
    font-size: 2.2rem;
    color: #FFD700;
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
}

    h2 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(to right, #fff, #FFD700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
    margin: 0;
    }
`;

const NavItem = styled.div`
    padding: 1rem 1.2rem;
    margin: 0.3rem 0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    background: ${props => props.active ? 'rgba(255,255,255,0.25)' : 'transparent'};
    font-weight: ${props => props.active ? '600' : 'normal'};

    &:hover {
    background-color: rgba(255,255,255,0.15);
    
    svg {
        color: #FFD700;
    }
    }

    svg {
    font-size: 1.3rem;
    transition: all 0.3s ease;
    color: ${props => props.active ? '#FFD700' : 'white'};
    min-width: 24px;
}
`;

const LogoutButton = styled.div`
    padding: 1rem 1.2rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    margin-top: auto;
    position: sticky;
    bottom: 0;
    backdrop-filter: blur(5px);

    &:hover {
    background: rgba(255, 255, 255, 0.2);
    
    svg {
        color: #FFD700;
    }
    }

    svg {
    font-size: 1.3rem;
    transition: all 0.3s ease;
}
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
`;

const ModalHeader = styled.div`
    padding: 20px 20px 0 20px;

    h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
}
`;

const ModalBody = styled.div`
    padding: 20px;
    
    p {
    margin: 0;
    color: #666;
    line-height: 1.5;
}
`;

const ModalFooter = styled.div`
    padding: 0 20px 20px 20px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
`;

const CancelButton = styled.button`
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: white;
    color: #666;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #ccc;
    }
    
    &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    }
`;

const ConfirmButton = styled.button`
    padding: 10px 20px;
    border: none;
    background: #dc3545;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
    background: #c82333;
    }

    &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
`;

const Barre = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/calendrier')) return 'calendrier';
    if (path.includes('/notification')) return 'notification';
    if (path.includes('/profil')) return 'profil';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/notifications')) return 'notifications';
    return 'dashboard';
    };

    const activeTab = getActiveTab();

    const handleNavigation = (route) => {
    navigate(route);
    };

    const handleLogoutClick = () => {
    setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    
    try {
        const response = await fetch('/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour inclure les cookies de session
        });

        if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        
        // Nettoyer le localStorage si vous stockez des données utilisateur
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        
        // Rediriger vers la page de connexion
        navigate('/');
        } else {
        throw new Error('Erreur lors de la déconnexion');
        }
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
      // Même en cas d'erreur, on peut rediriger vers la page de connexion
      // car la session côté client doit être nettoyée
        navigate('/');
    } finally {
        setIsLoggingOut(false);
        setShowLogoutModal(false);
    }
};

const handleLogoutCancel = () => {
    setShowLogoutModal(false);
};


  //profil
  //Notifications
  //Calendrier
  //tableau de bord
    return (
    <Container>
        <Sidebar>
        <LogoContainer>
            <FaLeaf />
            <h2>Presentation</h2>
        </LogoContainer>
        <NavItem active={activeTab === 'dashboard'} onClick={() => handleNavigation('/plateforme/dashboard')}>
            <MdDashboard /> Tableau de bord
        </NavItem>
                
        <NavItem active={activeTab === 'calendrier'} onClick={() => handleNavigation('/plateforme/calendrier')}>
            <FaCalendar /> Calendrier
        </NavItem>

        <NavItem active={activeTab === 'notification'} onClick={() => handleNavigation('/plateforme/notification')}>
            <FaBell /> Notifications
        </NavItem>

        <NavItem active={activeTab === 'profil'} onClick={() => handleNavigation('/plateforme/profil')}>
            <FaUser /> Profil
        </NavItem>

        <LogoutButton onClick={handleLogoutClick}>
            <FaSignOutAlt /> Déconnexion
        </LogoutButton>
        </Sidebar>

        {showLogoutModal && (
        <ModalOverlay>
        <ModalContent>
            <ModalHeader>
                <h3>Confirmation de déconnexion</h3>
            </ModalHeader>
            <ModalBody>
                <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            </ModalBody>
            <ModalFooter>
                <CancelButton onClick={handleLogoutCancel} disabled={isLoggingOut}>
                Annuler
            </CancelButton>
                <ConfirmButton onClick={handleLogoutConfirm} disabled={isLoggingOut}>
                {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
            </ConfirmButton>
            </ModalFooter>
        </ModalContent>
        </ModalOverlay>
    )}
    </Container>
    );
};

export default Barre;
