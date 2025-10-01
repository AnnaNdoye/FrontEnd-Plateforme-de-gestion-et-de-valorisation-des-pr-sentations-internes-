import { useState } from 'react';
import styled from 'styled-components';
import { FaList } from 'react-icons/fa';
import Barre from './Barre';

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
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
`;



    const Notification = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Container>
        {isMenuOpen && <Barre />}
        <Content>
            <Header>
                <h1>Les notifications</h1>
                <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
            </Header>
        </Content>
    </Container>
    );
}

export default Notification;

