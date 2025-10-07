import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope, FaAddressCard, FaAddressBook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { register } from '../services/api';

const Inscription = () => {
    const navigate = useNavigate();

    const retour = () => {
    console.log("Navigation vers /");
    navigate("/");
    }

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

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [poste, setPoste] = useState('');
    const [matricule, setMatricule] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    //const [ isLoading, setIsLoading ] = useState(false);
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
            <InputIcon><FaUser /></InputIcon>
            <Input
                type="text"
                name="prenom"
                placeholder="prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
            />
            </InputGroup>

            <InputGroup>
            <Label>Nom</Label>
            <InputIcon><FaUser /></InputIcon>
            <Input
                type="text"
                name="nom"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
            />
            </InputGroup>

            <InputGroup>
            <Label>Poste</Label>
            <InputIcon><FaAddressBook/></InputIcon>
            <Input
                type="text"
                name="poste"
                placeholder="Poste"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                required
            />
            </InputGroup>

            <InputGroup>
            <Label>Nom</Label>
            <InputIcon><FaAddressCard /></InputIcon>
            <Input
                type="text"
                name="matricule"
                placeholder="Matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                required
            />
            </InputGroup>

            <InputGroup>
            <Label>E-mail</Label>
            <InputIcon><FaEnvelope /></InputIcon>
            <Input
                type="text"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </InputGroup>

            <InputGroup>
            <Label>Mot de passe</Label>
            <InputIcon><FaLock /></InputIcon>
            <Input
                type="password"
                name="motDePasse"
                placeholder="••••••••••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                minLength="8"
            />
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