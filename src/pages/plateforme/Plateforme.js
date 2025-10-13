import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Plateforme = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            if (payload.exp <= currentTime) {
                localStorage.removeItem('token');
                navigate('/connexion');
            }
        } catch (error) {
            console.error('Invalid token in Plateforme:', error);
            localStorage.removeItem('token');
            navigate('/connexion');
        }
    }, [navigate]);

    return (
        <Dashboard />
    );
};

export default Plateforme;
