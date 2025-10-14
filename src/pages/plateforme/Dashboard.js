import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaList, FaCalendarAlt, FaBell, FaUser, FaChartBar, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Barre from './Barre';
import dashboardService from '../../services/dashboardService';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8F0 0%, #e6dfd9ff 100%);
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 20px rgba(255, 140, 66, 0.3);
`;

const WelcomeText = styled.div`
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.color || '#FF8C42'};

  &:hover {
    box-shadow: 0 6px 20px rgba(255, 140, 66, 0.2);
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.color || '#FF8C42'}20;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.8rem;
    color: ${props => props.color || '#FF8C42'};
  }
`;

const StatInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 0.3rem 0;
    font-size: 2rem;
    color: #333;
    font-weight: bold;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(255, 129, 19, 0.4);
    transform: translateY(-5px);
  }

  svg {
    font-size: 2.5rem;
    color: #ff8113;
    margin-bottom: 0.8rem;
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
    text-align: center;
  }

  p {
    margin: 0.3rem 0 0 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  color: #FF6B1A;
  margin: 2rem 0 1rem 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UpcomingList = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const UpcomingItem = styled.div`
  padding: 1rem;
  border-left: 4px solid ${props => props.color || '#FF8C42'};
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0.2rem 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Utilisateur';
    setUserName(name);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: <FaCalendarAlt />, title: 'Calendrier', path: '/plateforme/calendrier', description: 'Voir mes événements' },
    { icon: <FaBell />, title: 'Notifications', path: '/plateforme/notification', description: 'Voir les alertes' },
    { icon: <FaUser />, title: 'Profil', path: '/plateforme/profil', description: 'Mon compte' },
    { icon: <FaList />, title: 'Présentations', path: '/plateforme/presentations', description: 'Gérer mes présentations' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'planifiees': '#FF8C42',
      'confirmees': '#28a745',
      'terminees': '#007bff',
      'annulees': '#dc3545'
    };
    return colors[status] || '#FF8C42';
  };

  return (
    <Container>
      <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
      <Content>
        <Header>
          <WelcomeText>
            <h1>Bienvenue, {userName} !</h1>
            <p>Voici un aperçu de votre activité</p>
          </WelcomeText>
          <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
        </Header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            Chargement des statistiques...
          </div>
        ) : stats ? (
          <>
            <StatsGrid>
              <StatCard color="#FF8C42">
                <StatIcon color="#FF8C42">
                  <FaList />
                </StatIcon>
                <StatInfo>
                  <h3>{stats.totalPresentations || 0}</h3>
                  <p>Total Présentations</p>
                </StatInfo>
              </StatCard>

              <StatCard color="#28a745">
                <StatIcon color="#28a745">
                  <FaCheckCircle />
                </StatIcon>
                <StatInfo>
                  <h3>{stats.confirmees || 0}</h3>
                  <p>Confirmées</p>
                </StatInfo>
              </StatCard>

              <StatCard color="#FF8C42">
                <StatIcon color="#FF8C42">
                  <FaClock />
                </StatIcon>
                <StatInfo>
                  <h3>{stats.planifiees || 0}</h3>
                  <p>Planifiées</p>
                </StatInfo>
              </StatCard>

              <StatCard color="#007bff">
                <StatIcon color="#007bff">
                  <FaCheckCircle />
                </StatIcon>
                <StatInfo>
                  <h3>{stats.terminees || 0}</h3>
                  <p>Terminées</p>
                </StatInfo>
              </StatCard>

              <StatCard color="#dc3545">
                <StatIcon color="#dc3545">
                  <FaTimesCircle />
                </StatIcon>
                <StatInfo>
                  <h3>{stats.annulees || 0}</h3>
                  <p>Annulées</p>
                </StatInfo>
              </StatCard>

              <StatCard color="#6f42c1">
                <StatIcon color="#6f42c1">
                  <FaUser />
                </StatIcon>
                <StatInfo>
                  <h3>{stats.myPresentations || 0}</h3>
                  <p>Mes Présentations</p>
                </StatInfo>
              </StatCard>
            </StatsGrid>

            <SectionTitle>
              <FaCalendarAlt /> Présentations à venir ({stats.upcomingCount || 0})
            </SectionTitle>

            {stats.upcomingPresentations && stats.upcomingPresentations.length > 0 ? (
              <UpcomingList>
                {stats.upcomingPresentations.slice(0, 5).map((pres, index) => (
                  <UpcomingItem key={index} color={getStatusColor(pres.statut?.toLowerCase())}>
                    <h4>{pres.sujet}</h4>
                    <p><strong>Date :</strong> {new Date(pres.datePresentation).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p><strong>Heure :</strong> {new Date(pres.heureDebut).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(pres.heureFin).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    <p><strong>Présentateur :</strong> {pres.utilisateur?.prenom} {pres.utilisateur?.nom} ({pres.utilisateur?.departement})</p>
                    <p><strong>Statut :</strong> <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(pres.statut?.toLowerCase()),
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>{pres.statut}</span></p>
                  </UpcomingItem>
                ))}
              </UpcomingList>
            ) : (
              <UpcomingList>
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  Aucune présentation à venir dans les 30 prochains jours
                </p>
              </UpcomingList>
            )}

            <SectionTitle>
              <FaChartBar /> Actions rapides
            </SectionTitle>
            <CardGrid>
              {quickActions.map((action, index) => (
                <Card key={index} onClick={() => navigate(action.path)}>
                  {action.icon}
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </Card>
              ))}
            </CardGrid>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Erreur lors du chargement des statistiques
          </div>
        )}
      </Content>
    </Container>
  );
}

export default Dashboard;
