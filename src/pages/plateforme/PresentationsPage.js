import { useState } from 'react';
import styled from 'styled-components';
import { FaList, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import Barre from './Barre';

const Container = styled.div`
  display: flex;
  background: linear-gradient(135deg, #FFF8F0 0%, #e6dfd9ff 100%);
`;

const Content = styled.div`
  flex: 1;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 248, 240, 0.8);
  border-radius: 12px;
  margin: 1rem;
  box-shadow: 0 4px 20px rgba(255, 140, 66, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%);
  border-radius: 8px;
  color: white;
`;

const StatusSection = styled.div`
  margin-bottom: 2rem;
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #FF6B1A;
`;

const PresentationList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PresentationCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'Planifié': return '#FF8C42';
      case 'Confirmé': return '#28a745';
      case 'Terminé': return '#007bff';
      case 'Annulé': return '#dc3545';
      default: return '#FF8C42';
    }
  }};
`;

const PresentationTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const PresentationDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const PresentationDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const PresentationStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch(props.status) {
      case 'Planifié': return '#FF8C42';
      case 'Confirmé': return '#28a745';
      case 'Terminé': return '#007bff';
      case 'Annulé': return '#dc3545';
      default: return '#FF8C42';
    }
  }};
`;

const PresentationsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Dummy data for presentations
  const presentations = [
    {
      id: 1,
      subject: 'Présentation IA et Innovation',
      description: 'Exploration des dernières avancées en intelligence artificielle',
      status: 'Planifié',
      presentationDate: '2024-12-15',
      startTime: '10:00'
    },
    {
      id: 2,
      subject: 'Développement Durable',
      description: 'Stratégies pour un avenir durable',
      status: 'Confirmé',
      presentationDate: '2024-12-10',
      startTime: '14:00'
    },
    {
      id: 3,
      subject: 'Technologies Web Modernes',
      description: 'React, Node.js et les frameworks contemporains',
      status: 'Terminé',
      presentationDate: '2024-11-28',
      startTime: '09:00'
    },
    {
      id: 4,
      subject: 'Sécurité Informatique',
      description: 'Les menaces actuelles et les solutions',
      status: 'Annulé',
      presentationDate: '2024-12-05',
      startTime: '11:00'
    },
    {
      id: 5,
      subject: 'Big Data Analytics',
      description: 'Analyse de données à grande échelle',
      status: 'Planifié',
      presentationDate: '2024-12-20',
      startTime: '15:30'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Planifié': return <FaClock />;
      case 'Confirmé': return <FaCheckCircle />;
      case 'Terminé': return <FaCheckCircle />;
      case 'Annulé': return <FaTimesCircle />;
      default: return <FaCalendarAlt />;
    }
  };

  const groupedPresentations = presentations.reduce((acc, presentation) => {
    if (!acc[presentation.status]) {
      acc[presentation.status] = [];
    }
    acc[presentation.status].push(presentation);
    return acc;
  }, {});

  const statusOrder = ['Planifié', 'Confirmé', 'Terminé', 'Annulé'];

  return (
    <Container>
      {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
      <Content>
        <Header>
          <h1>Présentations</h1>
          <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
        </Header>

        {statusOrder.map(status => (
          groupedPresentations[status] && (
            <StatusSection key={status}>
              <StatusHeader>
                {getStatusIcon(status)}
                {status} ({groupedPresentations[status].length})
              </StatusHeader>
              <PresentationList>
                {groupedPresentations[status].map(presentation => (
                  <PresentationCard key={presentation.id} status={status}>
                    <PresentationTitle>{presentation.subject}</PresentationTitle>
                    <p>{presentation.description}</p>
                    <PresentationDetails>
                      <PresentationDate>
                        {presentation.presentationDate} à {presentation.startTime}
                      </PresentationDate>
                      <PresentationStatus status={status}>
                        {status}
                      </PresentationStatus>
                    </PresentationDetails>
                  </PresentationCard>
                ))}
              </PresentationList>
            </StatusSection>
          )
        ))}
      </Content>
    </Container>
  );
};

export default PresentationsPage;
