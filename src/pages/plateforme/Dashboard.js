import { useState } from 'react';
import styled from 'styled-components';
import { FaList } from 'react-icons/fa';
import Barre from './Barre';
import Recherche from './Recherche';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #FFF8F0 0%, #e6dfd9ff 100%);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;



const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Container>
      {isMenuOpen && <Barre />}
      <Content>
        <Header>
          <h1>Bienvenue sur le tableau de bord</h1>
          <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
        </Header>
        <Recherche />
      </Content>
    </Container>
  );
}

export default Dashboard;

