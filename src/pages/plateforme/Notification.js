import { useState } from 'react';
import styled from 'styled-components';
import { FaList, FaCheck, FaTrash } from 'react-icons/fa';
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
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
`;

const NotificationList = styled.ul`
    list-style: none;
    padding: 0;
`;

const NotificationItem = styled.li`
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: ${props => (props.read ? 'normal' : 'bold')};
`;

const NotificationText = styled.span`
    flex: 1;
`;

const NotificationActions = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const Timestamp = styled.span`
    font-size: 0.8rem;
    color: #666;
    margin-left: 1rem;
`;

const Notification = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [notifications, setNotifications] = useState([
        { id: 1, text: "Anna Ndoye a enregistré une présentation pour Informatique à 14h00", read: false, timestamp: "14:00" },
        { id: 2, text: "Fatoumata Dial soumis un rapport pour Mathématiques à 10h30", read: false, timestamp: "10:30" },
        { id: 3, text: "Sindy Sira a planifié une réunion pour Physique à 16h00", read: true, timestamp: "16:00" },
        { id: 4, text: "El Hadj Babacar a validé une demande pour Chimie à 12h00", read: true, timestamp: "12:00" }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    return (
        <Container>
        {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
        <Content>
            <Header>
                <h1>Les notifications</h1>
                <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
            </Header>
            <NotificationList>
                {notifications.map((notif) => (
                    <NotificationItem key={notif.id} read={notif.read}>
                        <NotificationText>{notif.text}</NotificationText>
                        <Timestamp>{notif.timestamp}</Timestamp>
                        <NotificationActions>
                            {!notif.read && <FaCheck onClick={() => markAsRead(notif.id)} style={{ cursor: 'pointer', color: 'green' }} />}
                            <FaTrash onClick={() => deleteNotification(notif.id)} style={{ cursor: 'pointer', color: 'red' }} />
                        </NotificationActions>
                    </NotificationItem>
                ))}
            </NotificationList>
        </Content>
    </Container>
    );
}

export default Notification;

