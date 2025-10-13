import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaList, FaUser, FaEnvelope, FaBriefcase, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import Barre from './Barre';
import defaultProfileImage from '../../images/photo_de_profil_par_defaut.jpg';
import { getProfile, updateProfile } from '../../services/api';

const Container = styled.div`
    display: flex;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    overflow-x: hidden;
    background: linear-gradient(135deg, #FFF8F0 0%, #e6dfd9ff 100%);
`;

const Content = styled.div`
    flex: 1;
    padding: 2rem 4rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    h1 {
        font-size: 2.5rem;
        color: #333;
    }
`;

const ProfileCard = styled.div`
    background: linear-gradient(145deg, #ffffff, #ffe6cc);
    border-radius: 20px;
    padding: 3rem 4rem;
    box-shadow: 0 10px 20px rgba(255, 130, 0, 0.3);
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    transition: box-shadow 0.3s ease;
    &:hover {
        box-shadow: 0 15px 30px rgba(255, 140, 0, 0.6);
    }
`;

const ProfileImage = styled.img`
    width: 250px;
    height: 250px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1.5rem;
    border: 5px solid #ff8113;
    box-shadow: 0 0 15px rgba(255, 129, 19, 0.7);
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
    }
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.8rem 0;
    border-bottom: 1px solid #ffd1a3;
    width: 2000px;
    max-width: 700px;
    gap: 1rem;
    &:last-child {
        border-bottom: none;
    }
`;

const Label = styled.span`
    font-weight: 700;
    color: #ff8113;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Value = styled.span`
    color: #444;
    font-size: 1.1rem;
    flex-grow: 1;
`;

const Input = styled.input`
    width: 100%;
    max-width: 700px;
    padding: 0.6rem 1rem;
    font-size: 1.1rem;
    border: 2px solid #ffb366;
    border-radius: 8px;
    transition: border-color 0.3s ease;
    &:focus {
        border-color: #ff8113;
        outline: none;
        box-shadow: 0 0 8px #ff8113;
    }
`;

const Button = styled.button`
    margin-top: 1.5rem;
    padding: 0.8rem 2rem;
    background: linear-gradient(45deg, #ff8113, #ffb366);
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(255, 129, 19, 0.6);
    transition: background 0.3s ease, box-shadow 0.3s ease;
    &:hover {
        background: linear-gradient(45deg, #e67300, #ff9c1a);
        box-shadow: 0 6px 20px rgba(230, 115, 0, 0.8);
    }
`;

const Profil = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        nom: 'Nom Utilisateur',
        prenom: 'Prénom Utilisateur',
        email: 'utilisateur@gmail.com',
        poste: 'Poste Utilisateur',
        matricule: 'Anna123456789',
        dateInscription: new Date().toISOString(),
        photo: null,
    });
    const [originalProfile, setOriginalProfile] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();
                setProfile({
                    ...data,
                    photo: data.photoUrl || null,
                });
                setOriginalProfile({
                    ...data,
                    photo: data.photoUrl || null,
                });
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        };
        loadProfile();

        // Cleanup function to revoke object URLs on unmount
        return () => {
            if (profile.photo && profile.photo.startsWith('blob:')) {
                URL.revokeObjectURL(profile.photo);
            }
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setOriginalProfile({ ...profile });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke previous object URL to prevent memory leaks
            if (profile.photo && profile.photo.startsWith('blob:')) {
                URL.revokeObjectURL(profile.photo);
            }
            const photoURL = URL.createObjectURL(file);
            setProfile((prev) => ({
                ...prev,
                photo: photoURL,
            }));
        }
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                nom: profile.nom,
                prenom: profile.prenom,
                email: profile.email,
                poste: profile.poste,
                matricule: profile.matricule,
                photoUrl: profile.photo,
            };
            await updateProfile(updatedData);
            setIsEditing(false);
            setOriginalProfile({ ...profile });
        } catch (error) {
            console.error('Failed to save profile:', error);
        }
    };

    const handleCancel = () => {
        setProfile({ ...originalProfile });
        setIsEditing(false);
    };
    
    return (
        <Container>
            {isMenuOpen && <Barre />}
            <Content>
                <Header>
                    <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
                </Header>
                <ProfileCard>
                    <ProfileImage src={profile.photo ? profile.photo : defaultProfileImage} alt="Photo de profil" />
                    {isEditing ? (
                        <>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ marginBottom: '1rem', cursor: 'pointer', borderRadius: '8px', padding: '0.5rem', border: '2px solid #ff8113' }} />
                            <InfoItem>
                                <Label><FaUser /> Nom:</Label>
                                <Input name="nom" value={profile.nom} onChange={handleChange} />
                            </InfoItem>
                            <InfoItem>
                                <Label><FaUser /> Prénom:</Label>
                                <Input name="prenom" value={profile.prenom} onChange={handleChange} />
                            </InfoItem>
                            <InfoItem>
                                <Label><FaEnvelope /> Email:</Label>
                                <Input name="email" value={profile.email} onChange={handleChange} />
                            </InfoItem>
                            <InfoItem>
                                <Label><FaBriefcase /> Poste:</Label>
                                <Input name="poste" value={profile.poste} onChange={handleChange} />
                            </InfoItem>
                            <InfoItem>
                                <Label><FaIdCard /> Matricule:</Label>
                                <Input name="matricule" value={profile.matricule} onChange={handleChange} />
                            </InfoItem>
                            <InfoItem>
                                <Label><FaCalendarAlt /> Date d'inscription:</Label>
                                <Value>{new Date(profile.dateInscription).toLocaleDateString()}</Value>
                            </InfoItem>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button onClick={handleSave}>Sauvegarder</Button>
                                <Button onClick={handleCancel} style={{ background: 'linear-gradient(45deg, #ccc, #999)' }}>Annuler</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <InfoItem>
                                <Label><FaUser /> Nom:</Label>
                                <Value>{profile.nom}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label><FaUser /> Prénom:</Label>
                                <Value>{profile.prenom}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label><FaEnvelope /> Email:</Label>
                                <Value>{profile.email}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label><FaBriefcase /> Poste:</Label>
                                <Value>{profile.poste}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label><FaIdCard /> Matricule:</Label>
                                <Value>{profile.matricule}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label><FaCalendarAlt /> Date d'inscription:</Label>
                                <Value>{new Date(profile.dateInscription).toLocaleDateString()}</Value>
                            </InfoItem>
                            <Button onClick={toggleEdit}>Modifier le profil</Button>
                        </>
                    )}
                </ProfileCard>
            </Content>
        </Container>
    );
}

export default Profil;

