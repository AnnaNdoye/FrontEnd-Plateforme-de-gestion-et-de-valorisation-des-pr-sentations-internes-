import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaList, FaCalendarAlt, FaBell, FaUser } from 'react-icons/fa';
import Barre from '../plateforme/Barre';
import Recherche from './Recherche';

const Container = styled.div`
  display: flex;
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
  margin-bottom: 1rem;
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
    margin-bottom: 0.5rem;
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }

  p {
    margin: 0.3rem 0 0 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const quickActions = [
    { icon: <FaCalendarAlt />, title: 'Voir le calendrier', path: '/plateforme/calendrier' },
    { icon: <FaBell />, title: 'Notifications', path: '/plateforme/notification' },
    { icon: <FaUser />, title: 'Profil', path: '/plateforme/profil' },
  ];

  const stats = [
    { title: 'Présentations récentes', value: 12 },
    { title: 'Événements à venir', value: 5 },
  ];

  return (
    <Container>
      {isMenuOpen && <Barre />}
      <Content>
        <Header>
          <h1>Bienvenue sur le tableau de bord</h1>
          <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
        </Header>
        <Recherche />
        <CardGrid>
          {quickActions.map((action, index) => (
            <Card key={index} tabIndex={0} role="button" aria-pressed="false" onClick={() => navigate(action.path)}>
              {action.icon}
              <h3>{action.title}</h3>
            </Card>
          ))}
          {stats.map((stat, index) => (
            <Card key={`stat-${index}`} tabIndex={0} aria-label={`${stat.title}: ${stat.value}`}>
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </Card>
          ))}
        </CardGrid>
      </Content>
    </Container>
  );
}

export default Dashboard;

