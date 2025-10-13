import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope } from 'react-icons/fa';
import { requestPasswordReset } from '../services/api';

const Form = styled.form`
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 2.1rem 3rem;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(76, 175, 80, 0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    `;

const InputGroup = styled.div`
    position: relative;
    margin-bottom: 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    `;

const Label = styled.label`
    font-size: 1rem;
    color: #2e7d32;
    font-weight: 600;
    margin-left: 0.5rem
    `;

const Input = styled.input`
    padding: 1.1rem 1.1rem 1.1rem 3.5rem;
    border: 2px solid #e0f2e9;
    border-radius: 14px;
    font-size: 1.05rem;
    transition: all 0.3s ease;
    background-color: #f7fdf9;
    &:focus {
        border-color: #FF8113;
        outline: none;
        box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15);
        background-color: white;
    }
    `;

const InputIcon = styled.div`
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: #FF8113;
    font-size: 1.2rem;
    `;

const SubmitButton = styled.button`
    padding: 1.2rem 2rem;
    background-color: #FF8113;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    `;

const LinksContainer = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    font-size: 0.9rem;
    color: #FF8113;
    `;

const StyledLink = styled(Link)`
    color: #FF8113;
    text-decoration: none;
    &:hover { text-decoration: underline; }
    `;

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const MotDePasseOublie = () => {
    const navigate = useNavigate();

    const retour = () => {
        console.log("Navigation vers /connexion");
        navigate("/connexion");
    };

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            await requestPasswordReset(email);
            setMessage('Un e-mail de réinitialisation a été envoyé à votre adresse.');
        } catch (error) {
            setMessage('Erreur : ' + (error.response?.data || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            margin: '0 auto',
            padding: '2rem 1rem',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <button
                onClick={retour}
                style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#FF8113',
                    fontWeight: 'bold',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    minWidth: '150px'
                }}
            >
                Retour
            </button>

            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Label>E-mail</Label>
                    <InputWrapper>
                        <InputIcon><FaEnvelope /></InputIcon>
                        <Input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </InputWrapper>
                </InputGroup>

                <SubmitButton type="submit" disabled={isLoading}>
                    {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
                </SubmitButton>

                {message && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: message.includes('Erreur') ? '#ffebee' : '#e8f5e8',
                        borderRadius: '8px',
                        color: message.includes('Erreur') ? '#c62828' : '#2e7d32',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <LinksContainer>
                    <StyledLink to="/connexion">
                        Retour à la connexion
                    </StyledLink>
                </LinksContainer>
            </Form>
        </div>
    );
};

export default MotDePasseOublie;
