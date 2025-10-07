import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope, FaAddressCard, FaAddressBook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { register } from '../services/api';

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

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
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
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
    &:hover {
        color: #e67010;
    }
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
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #e67010;
    }
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
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
    &:hover { text-decoration: underline; }
    `;

const Inscription = () => {
    const navigate = useNavigate();

    const retour = () => {
    console.log("Navigation vers /");
    navigate("/");
    }

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [poste, setPoste] = useState('');
    const [matricule, setMatricule] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [montrerMotDePasse, setMontrerMotDePasse] = useState(false);
    //const [ isLoading, setIsLoading ] = useState(false);

    const toggleMontrerMotDePasse = (e) => {
        e.preventDefault();
        setMontrerMotDePasse(!montrerMotDePasse);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = { prenom, nom, poste, matricule, email, motDePasse };
            await register(userData);
            alert('Inscription réussie, veuillez vous connecter.');
            navigate('/connexion');
        } catch (error) {
            alert('Erreur lors de l\'inscription : ' + (error.response?.data || error.message));
        }
    }

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
                fontweight: 'bold',
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
                <Label>Prénom</Label>
                <InputWrapper>
                    <InputIcon><FaUser /></InputIcon>
                    <Input
                        type="name"
                        name="prenom"
                        placeholder="Votre prénom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                    />
                </InputWrapper>
            </InputGroup>

            <InputGroup>
                <Label>Nom</Label>
                <InputWrapper>
                    <InputIcon><FaUser /></InputIcon>
                    <Input
                        type="name"
                        name="nom"
                        placeholder="Votre nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </InputWrapper>
            </InputGroup>

            <InputGroup>
                <Label>Poste</Label>
                <InputWrapper>
                    <InputIcon><FaAddressBook/></InputIcon>
                    <Input
                        type="text"
                        name="poste"
                        placeholder="Votre poste"
                        value={poste}
                        onChange={(e) => setPoste(e.target.value)}
                        required
                    />
                </InputWrapper>
            </InputGroup>

            <InputGroup>
            <Label>Matriule</Label>
            <InputWrapper>
                <InputIcon><FaAddressCard /></InputIcon>
                <Input
                    type="text"
                    name="matricule"
                    placeholder="Votre matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    required
                />
            </InputWrapper>
            </InputGroup>

            <InputGroup>
            <Label>E-mail</Label>
            <InputWrapper>
                <InputIcon><FaEnvelope /></InputIcon>
                <Input
                    type="email"
                    name="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </InputWrapper>
            </InputGroup>

            <InputGroup>
                <Label>Mot de passe</Label>
                <InputWrapper>
                <InputIcon><FaLock /></InputIcon>
                <Input
                    type={montrerMotDePasse ? "text" : "password"}
                    name="motDePasse"
                    placeholder="Votre mot de passe"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    required
                    minLength="8"
                />
                <TogglePasswordButton 
                    type="button"
                    onClick={toggleMontrerMotDePasse}
                    aria-label={montrerMotDePasse ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                >
                    {montrerMotDePasse ? <FaEyeSlash /> : <FaEye />}
                </TogglePasswordButton>
                </InputWrapper>
                <PasswordHelp>Minimum 8 caractères</PasswordHelp>
            </InputGroup>

            <SubmitButton type="submit" >
                {"S'inscrire"}
            </SubmitButton> 

            <LinksContainer>
            <StyledLink>
            </StyledLink>
            <StyledLink to="/connexion">
                Se connecter
            </StyledLink>
            </LinksContainer>
        </Form>
    </div>
    );
};

export default Inscription;