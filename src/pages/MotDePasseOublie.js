import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import { requestPasswordReset } from '../services/api';

const Container = styled.div`
  margin: 0 auto;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #FFF8F0 0%, #e6dfd9ff 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BackButton = styled.button`
  padding: 1rem 2rem;
  background-color: #FF8113;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  min-width: 150px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e67010;
    transform: translateX(-5px);
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 500px;
  padding: 2.5rem 3rem;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(76, 175, 80, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const Title = styled.h2`
  text-align: center;
  color: #FF6B1A;
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
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
  margin-left: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.1rem 1.1rem 1.1rem 3.5rem;
  border: 2px solid ${props => props.$error ? '#dc3545' : '#e0f2e9'};
  border-radius: 14px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background-color: #f7fdf9;
  box-sizing: border-box;

  &:focus {
    border-color: ${props => props.$error ? '#dc3545' : '#FF8113'};
    outline: none;
    box-shadow: 0 0 0 4px ${props => props.$error ? 'rgba(220, 53, 69, 0.15)' : 'rgba(76, 175, 80, 0.15)'};
    background-color: white;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${props => props.$error ? '#dc3545' : '#FF8113'};
  font-size: 1.2rem;
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem 2rem;
  background-color: ${props => props.disabled ? '#ccc' : '#FF8113'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #e67010;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 129, 19, 0.3);
  }
`;

const MessageBox = styled.div`
  margin-top: 1.5rem;
  padding: 1.2rem;
  background-color: ${props => props.$success ? '#e8f5e9' : '#ffebee'};
  border: 1px solid ${props => props.$success ? '#2e7d32' : '#c62828'};
  border-radius: 8px;
  color: ${props => props.$success ? '#2e7d32' : '#c62828'};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LinksContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: #FF8113;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: #e67010;
  }
`;

const Steps = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StepNumber = styled.div`
  min-width: 2rem;
  height: 2rem;
  background: #FF8113;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const MotDePasseOublie = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError && value) {
      if (validateEmail(value)) {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      setEmailError('L\'email est requis');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Veuillez saisir un email valide');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setEmailError('');
    
    try {
      await requestPasswordReset(email);
      setIsSuccess(true);
      setMessage('Un e-mail de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.');
      setEmail('');
    } catch (error) {
      setIsSuccess(false);
      const errorMsg = error.response?.data?.message || error.message || 'Une erreur est survenue';
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/connexion')}>
        <FaArrowLeft />
        Retour à la connexion
      </BackButton>

      <Form onSubmit={handleSubmit}>
        <Title>Mot de passe oublié ?</Title>
        <Subtitle>
          Pas de problème ! Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </Subtitle>

        <Steps>
          <Step>
            <StepNumber>1</StepNumber>
            <div>Saisissez votre adresse email</div>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <div>Vérifiez votre boîte de réception</div>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <div>Cliquez sur le lien pour réinitialiser</div>
          </Step>
        </Steps>

        <InputGroup>
          <Label>Adresse e-mail <span style={{ color: 'red' }}>*</span></Label>
          <InputWrapper>
            <InputIcon $error={!!emailError}>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="votreemail@exemple.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              $error={!!emailError}
              autoFocus
            />
          </InputWrapper>
          {emailError && (
            <ErrorText>
              <FaExclamationCircle />
              {emailError}
            </ErrorText>
          )}
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading || !email.trim()}>
          {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
        </SubmitButton>

        {message && (
          <MessageBox $success={isSuccess}>
            {isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
            {message}
          </MessageBox>
        )}

        <LinksContainer>
          <StyledLink to="/connexion">
            Retour à la connexion
          </StyledLink>
        </LinksContainer>
      </Form>
    </Container>
  );
};

export default MotDePasseOublie;