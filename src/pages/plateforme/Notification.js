import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaList, FaCheck, FaTrash, FaCheckDouble, FaBell } from 'react-icons/fa';
import Barre from './Barre';
import notificationService from '../../services/notificationService';

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
    margin-bottom: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%);
    border-radius: 8px;
    color: white;
    h1 {
        margin: 0;
    }
`;

const NotificationList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

// CORRECTION : utiliser $read et $typeAction au lieu de read et typeAction
const NotificationItem = styled.li`
    background: ${props => props.$read ? '#f9f9f9' : '#fff'};
    border: 1px solid ${props => props.$read ? '#ddd' : '#FF8C42'};
    border-left: 4px solid ${props => {
        switch(props.$typeAction) {
            case 'AJOUT': return '#28a745';
            case 'MODIFICATION': return '#FF8C42';
            case 'SUPPRESSION': return '#dc3545';
            default: return '#FF8C42';
        }
    }};
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.8rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: ${props => (props.$read ? 'normal' : 'bold')};
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 8px rgba(255, 140, 66, 0.2);
        transform: translateY(-2px);
    }
`;

// CORRECTION : utiliser $read au lieu de read
const NotificationText = styled.span`
    flex: 1;
    color: ${props => props.$read ? '#666' : '#333'};
`;

const NotificationActions = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

const Timestamp = styled.span`
    font-size: 0.8rem;
    color: #666;
    margin-left: 1rem;
    font-style: italic;
`;

// CORRECTION : utiliser $danger au lieu de danger
const ActionButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: ${props => props.$danger ? '#ffebee' : '#e8f5e9'};
    }

    svg {
        color: ${props => props.$danger ? '#dc3545' : '#28a745'};
        font-size: 1.2rem;
    }
`;

const StatsBar = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

// CORRECTION : utiliser $active au lieu de active
const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: ${props => props.$active ? '#FF8C42' : '#f0f0f0'};
    color: ${props => props.$active ? 'white' : '#333'};
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: ${props => props.$active ? '#FF6B1A' : '#e0e0e0'};
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem;
    color: #666;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    svg {
        font-size: 3rem;
        color: #FF8C42;
        margin-bottom: 1rem;
    }
`;

const Notification = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getMyNotifications();
            setNotifications(data);
            
            const unread = data.filter(n => !n.lue).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (idNotification) => {
        try {
            await notificationService.markAsRead(idNotification);
            await loadNotifications();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            await loadNotifications();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const deleteNotification = async (idNotification) => {
        if (window.confirm('Supprimer cette notification ?')) {
            try {
                await notificationService.deleteNotification(idNotification);
                await loadNotifications();
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date invalide';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.lue;
        if (filter === 'read') return notif.lue;
        return true;
    });

    return (
        <Container>
            {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
            <Content>
                <Header>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
                        <h1 style={{ margin: 0 }}>Notifications</h1>
                    </div>
                    {unreadCount > 0 && (
                        <ActionButton onClick={markAllAsRead} style={{ color: 'white' }}>
                            <FaCheckDouble style={{ marginRight: '0.5rem' }} />
                            Tout marquer comme lu
                        </ActionButton>
                    )}
                </Header>

                <StatsBar>
                    {/* CORRECTION : utiliser $active */}
                    <StatItem $active={filter === 'all'} onClick={() => setFilter('all')}>
                        <FaBell />
                        Toutes ({notifications.length})
                    </StatItem>
                    <StatItem $active={filter === 'unread'} onClick={() => setFilter('unread')}>
                        <FaBell />
                        Non lues ({unreadCount})
                    </StatItem>
                    <StatItem $active={filter === 'read'} onClick={() => setFilter('read')}>
                        <FaCheck />
                        Lues ({notifications.length - unreadCount})
                    </StatItem>
                </StatsBar>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Chargement des notifications...
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <EmptyState>
                        <FaBell />
                        <h3>Aucune notification</h3>
                        <p>Vous n'avez aucune notification {filter === 'unread' ? 'non lue' : filter === 'read' ? 'lue' : ''}</p>
                    </EmptyState>
                ) : (
                    <NotificationList>
                        {filteredNotifications.map((notif) => (
                            <NotificationItem 
                                key={notif.idNotification} 
                                $read={notif.lue}
                                $typeAction={notif.notification?.typeAction}
                            >
                                <NotificationText $read={notif.lue}>
                                    {notif.notification?.message || 'Notification'}
                                </NotificationText>
                                <Timestamp>
                                    {formatDate(notif.notification?.dateDeReception)}
                                </Timestamp>
                                <NotificationActions>
                                    {!notif.lue && (
                                        <ActionButton 
                                            onClick={() => markAsRead(notif.idNotification)}
                                            title="Marquer comme lue"
                                        >
                                            <FaCheck />
                                        </ActionButton>
                                    )}
                                    <ActionButton 
                                        onClick={() => deleteNotification(notif.idNotification)}
                                        $danger
                                        title="Supprimer"
                                    >
                                        <FaTrash />
                                    </ActionButton>
                                </NotificationActions>
                            </NotificationItem>
                        ))}
                    </NotificationList>
                )}
            </Content>
        </Container>
    );
}

export default Notification;