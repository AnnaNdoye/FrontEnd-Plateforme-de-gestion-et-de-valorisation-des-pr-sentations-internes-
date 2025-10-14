import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope, FaAddressCard, FaAddressBook, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { register } from '../services/api';

const Container = styled.div`
    margin: 0 auto;
    padding: 2rem 1rem;
    backgroundColor: #f5f5f5;
    minHeight: 100vh;
`;

const RetourButton = styled.button`
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
    transition: all 0.3s ease;
    margin-bottom: 2rem;
    
    &:hover {
        background-color: #e67010;
        transform: translateX(-5px);
    }
`;

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
    margin-left: 0.5rem;
`;

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const Input = styled.input`
    width: 100%;
    padding: 1.1rem 1.1rem 1.1rem 3.5rem;
    border: 2px solid #e0f2e9;
    border-radius: 14px;
    font-size: 1.05rem;
    transition: all 0.3s ease;
    background-color: #f7fdf9;
    box-sizing: border-box;

    &:focus {
        border-color: #FF8113;
        outline: none;
        box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15);
        background-color: white;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 1.1rem 1.1rem 1.1rem 3.5rem;
    border: 2px solid #e0f2e9;
    border-radius: 14px;
    font-size: 1.05rem;
    transition: all 0.3s ease;
    background-color: #f7fdf9;
    box-sizing: border-box;
    cursor: pointer;

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
    pointer-events: none;
`;

const TogglePasswordButton = styled.button`
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #FF8113;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    
    &:focus {
        outline: none;
    }
`;

const PasswordHelp = styled.small`
    font-size: 0.85rem;
    color: #666;
    margin-left: 0.5rem;
    margin-top: 0.3rem;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 1.2rem 2rem;
    background-color: #FF8113;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #e67010;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 129, 19, 0.3);
    }
    
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
    }
`;

const LinksContainer = styled.div`
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #FF8113;
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

const ErrorMessage = styled.div`
    background-color: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #c62828;
`;

const SuccessMessage = styled.div`
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #2e7d32;
`;

const Inscription = () => {
    const navigate = useNavigate();

    const retour = () => {
        navigate("/");
    }

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [poste, setPoste] = useState('');
    const [matricule, setMatricule] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [montrerMotDePasse, setMontrerMotDePasse] = useState(false);
    const [departement, setDepartement] = useState('SICO');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const departements = [
        { value: 'SICO', label: 'SICO' },
        { value: 'IT', label: 'IT' },
        { value: 'DATA', label: 'DATA' },
        { value: 'RH', label: 'Ressources Humaines' },
        { value: 'FINANCE', label: 'Finance' },
        { value: 'MARKETING', label: 'Marketing' },
        { value: 'COMMERCIAL', label: 'Commercial' },
        { value: 'TECHNIQUE', label: 'Technique' }
    ];

    const toggleMontrerMotDePasse = (e) => {
        e.preventDefault();
        setMontrerMotDePasse(!montrerMotDePasse);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (motDePasse.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsLoading(true);

        try {
            const userData = { 
                prenom, 
                nom, 
                poste, 
                matricule, 
                email, 
                motDePasse, 
                departement 
            };
            
            await register(userData);
            setSuccess('Inscription réussie ! Redirection vers la page de connexion...');
            
            setTimeout(() => {
                navigate('/connexion');
            }, 2000);
        } catch (error) {
            console.error('Erreur inscription:', error);
            const errorMsg = error.message || error.error || 'Erreur lors de l\'inscription';
            setError(errorMsg);
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <RetourButton onClick={retour}>
                <FaArrowLeft />
                Retour
            </RetourButton>

            <Form onSubmit={handleSubmit}>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <InputGroup>
                    <Label>Prénom <span style={{ color: 'red' }}>*</span></Label>
                    <InputWrapper>
                        <InputIcon><FaUser /></InputIcon>
                        <Input
                            type="text"
                            name="prenom"
                            placeholder="Votre prénom"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength="2"
                        />
                    </InputWrapper>
                </InputGroup>

                <InputGroup>
                    <Label>Nom <span style={{ color: 'red' }}>*</span></Label>
                    <InputWrapper>
                        <InputIcon><FaUser /></InputIcon>
                        <Input
                            type="text"
                            name="nom"
                            placeholder="Votre nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength="2"
                        />
                    </InputWrapper>
                </InputGroup>

                <InputGroup>
                    <Label>Poste <span style={{ color: 'red' }}>*</span></Label>
                    <InputWrapper>
                        <InputIcon><FaAddressBook/></InputIcon>
                        <Input
                            type="text"
                            name="poste"
                            placeholder="Votre poste"
                            value={poste}
                            onChange={(e) => setPoste(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </InputWrapper>
                </InputGroup>

                <InputGroup>
                    <Label>Matricule <span style={{ color: 'red' }}>*</span></Label>
                    <InputWrapper>
                        <InputIcon><FaAddressCard /></InputIcon>
                        <Input
                            type="text"
                            name="matricule"
                            placeholder="Votre matricule"
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </InputWrapper>
                </InputGroup>

                <InputGroup>
                    <Label>Département <span style={{ color: 'red' }}>*</span></Label>
                    <InputWrapper>
                        <InputIcon><FaAddressBook /></InputIcon>
                        <Select
                            name="departement"
                            value={departement}
                            onChange={(e) => setDepartement(e.target.value)}
                            required
                            disabled={isLoading}
                        >
                            {departements.map((dep) => (
                                <option key={dep.value} value={dep.value}>
                                    {dep.label}
                                </option>
                            ))}
                        </Select>
                    </InputWrapper>
                </InputGroup>

                <InputGroup>
                    <Label>E-mail <span style={{ color: 'red' }}>*</span></Label>
                    <InputWrapper>
                        <InputIcon><FaEnvelope /></InputIcon>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Votre adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </InputWrapper>
                </InputGroup>

                <InputGroup>
                    <Label>Mot de passe <span style={{ color: 'red' }}>*</span></Label>
                    <InputWrapper>
                        <InputIcon><FaLock /></InputIcon>
                        <Input
                            type={montrerMotDePasse ? "text" : "password"}
                            name="motDePasse"
                            placeholder="Votre mot de passe"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            required
                            minLength="6"
                            disabled={isLoading}
                        />
                        <TogglePasswordButton 
                            type="button"
                            onClick={toggleMontrerMotDePasse}
                            disabled={isLoading}
                        >
                            {montrerMotDePasse ? <FaEyeSlash /> : <FaEye />}
                        </TogglePasswordButton>
                    </InputWrapper>
                    <PasswordHelp>Minimum 6 caractères</PasswordHelp>
                </InputGroup>

                <SubmitButton type="submit" disabled={isLoading}>
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </SubmitButton> 

                <LinksContainer>
                    <StyledLink to="/connexion">
                        Déjà inscrit ? Se connecter
                    </StyledLink>
                </LinksContainer>
            </Form>
        </Container>
    );
};

export default Inscription;