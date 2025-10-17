import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaDownload, FaStar, FaComment, FaUser, FaCalendarAlt, FaClock, FaFileAlt } from 'react-icons/fa';
import Barre from './Barre';
import presentationService from '../../services/presentationService';
import commentaireService from '../../services/commentaireService';
import voteService from '../../services/voteService';

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
  background-color: rgba(255, 248, 240, 0.8);
  border-radius: 12px;
  margin: 1rem;
  margin-left: ${props => props.$isMenuOpen ? '300px' : '1rem'};
  box-shadow: 0 4px 20px rgba(255, 140, 66, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%);
  border-radius: 8px;
  color: white;

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const PresentationSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #FF8C42;
`;

const SectionTitle = styled.h2`
  color: #FF6B1A;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
`;

const PresentationInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#FF8C42'};
`;

const InfoLabel = styled.div`
  font-weight: bold;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const InfoValue = styled.div`
  color: #333;
  font-size: 1.1rem;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  background-color: ${props => props.color};
  display: inline-block;
`;

const FilesSection = styled.div`
  margin-top: 2rem;
`;

const FileList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FileItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f0f0f0;
  border-radius: 6px;
  text-decoration: none;
  color: #FF8C42;
  transition: background-color 0.3s;

  &:hover {
    background: #e0e0e0;
  }
`;

const CommentsSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #28a745;
`;

const CommentItem = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #fafafa;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.div`
  font-weight: bold;
  color: #FF6B1A;
`;

const CommentDate = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const CommentContent = styled.div`
  color: #333;
  line-height: 1.5;
`;

const VotesSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #007bff;
`;

const VoteItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #fafafa;
`;

const VoteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const VoteRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #FFD700;
  font-weight: bold;
`;

const AddCommentSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #FFE5CC;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #FF8C42;
  }
`;

const AddVoteSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Star = styled(FaStar)`
  font-size: 2rem;
  cursor: pointer;
  color: ${props => props.$filled ? '#FFD700' : '#ddd'};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.disabled ? '#ccc' : '#FF8C42'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: #FF6B1A;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const Error = styled.div`
  text-align: center;
  padding: 3rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 8px;
  margin: 2rem 0;
`;

const DetailPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [presentation, setPresentation] = useState(null);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newVote, setNewVote] = useState(0);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    loadPresentationDetails();
  }, [id]);

  const loadPresentationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const presentationData = await presentationService.getPresentationById(parseInt(id));
      setPresentation(presentationData);

      const commentsData = await commentaireService.getCommentairesByPresentation(parseInt(id));
      setComments(commentsData);

      const votesData = await voteService.getVotesByPresentation(parseInt(id));
      setVotes(votesData);

    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Veuillez saisir un commentaire');
      return;
    }

    try {
      setIsAddingComment(true);
      await commentaireService.addCommentaire(parseInt(id), newComment);
      setNewComment('');
      await loadPresentationDetails();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleAddVote = async () => {
    if (newVote < 1 || newVote > 5) {
      alert('Veuillez choisir une note entre 1 et 5');
      return;
    }

    try {
      setIsVoting(true);
      await voteService.addOrUpdateVote(parseInt(id), newVote);
      setNewVote(0);
      await loadPresentationDetails();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors du vote');
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planifié': '#FF8C42',
      'Confirmé': '#28a745',
      'Terminé': '#007bff',
      'Annulé': '#dc3545'
    };
    return colors[status] || '#FF8C42';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';

    // Handle numeric times (floats like 15.0)
    const num = parseFloat(timeStr);
    if (!isNaN(num)) {
      const hours = Math.floor(num);
      const minutes = Math.round((num - hours) * 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Gérer les formats d'heure LocalTime du backend (ex: "10:00:00", "14:30", "9:5")
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        // Formater explicitement en hh:mm avec zéros de remplissage
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    // Si c'est un objet LocalTime, le convertir en string hh:mm
    if (timeStr && typeof timeStr === 'object' && timeStr.hour !== undefined && timeStr.minute !== undefined) {
      const hours = timeStr.hour.toString().padStart(2, '0');
      const minutes = timeStr.minute.toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return timeStr;
  };

  const downloadFile = (fileName) => {
    window.open(`http://localhost:8080/uploads/presentations/${fileName}`, '_blank');
  };

  if (loading) {
  return (
    <Container>
      {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
      <Content $isMenuOpen={isMenuOpen}>
          <Loading>Chargement...</Loading>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
        <Content $isMenuOpen={isMenuOpen}>
          <Header>
            <BackButton onClick={() => navigate('/plateforme/presentations')}>
              <FaArrowLeft /> Retour
            </BackButton>
            <h1>Détails</h1>
            <div></div>
          </Header>
          <Error>{error}</Error>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
      <Content $isMenuOpen={isMenuOpen}>
        <Header>
          <BackButton onClick={() => navigate('/plateforme/presentations')}>
            <FaArrowLeft /> Retour aux présentations
          </BackButton>
          <h1>Détails de la présentation</h1>
          <div></div>
        </Header>

        <PresentationSection>
          <SectionTitle>
            <FaFileAlt /> Informations
          </SectionTitle>

          <PresentationInfo>
            <InfoCard color="#FF8C42">
              <InfoLabel>Sujet</InfoLabel>
              <InfoValue>{presentation.sujet}</InfoValue>
            </InfoCard>

            <InfoCard color="#28a745">
              <InfoLabel>Statut</InfoLabel>
              <InfoValue>
                <StatusBadge color={getStatusColor(presentation.statut)}>
                  {presentation.statut}
                </StatusBadge>
              </InfoValue>
            </InfoCard>

            <InfoCard color="#007bff">
              <InfoLabel>Date de début</InfoLabel>
              <InfoValue>
                <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                {formatDate(presentation.datePresentation)}
              </InfoValue>
            </InfoCard>

            <InfoCard color="#6f42c1">
              <InfoLabel>Horaires</InfoLabel>
              <InfoValue>
                <FaClock style={{ marginRight: '0.5rem' }} />
                {presentation.heureDebut && presentation.heureFin
                  ? `${formatTime(presentation.heureDebut)} - ${formatTime(presentation.heureFin)}`
                  : presentation.heureDebut
                  ? `Début: ${formatTime(presentation.heureDebut)}`
                  : presentation.heureFin
                  ? `Fin: ${formatTime(presentation.heureFin)}`
                  : 'Non spécifié'
                }
              </InfoValue>
            </InfoCard>

            {presentation.prenomUtilisateur && presentation.nomUtilisateur && (
              <>
                <InfoCard color="#fd7e14">
                  <InfoLabel>Présentateur</InfoLabel>
                  <InfoValue>
                    <FaUser style={{ marginRight: '0.5rem' }} />
                    {presentation.prenomUtilisateur} {presentation.nomUtilisateur}
                  </InfoValue>
                </InfoCard>

                <InfoCard color="#20c997">
                  <InfoLabel>Département</InfoLabel>
                  <InfoValue>{presentation.departementUtilisateur}</InfoValue>
                </InfoCard>
              </>
            )}
          </PresentationInfo>

          {presentation.description && (
            <InfoCard>
              <InfoLabel>Description</InfoLabel>
              <InfoValue style={{ whiteSpace: 'pre-wrap' }}>{presentation.description}</InfoValue>
            </InfoCard>
          )}

          {presentation.fichier && presentation.fichier.trim() && (
            <FilesSection>
              <InfoLabel>Fichiers joints</InfoLabel>
              <FileList>
                {presentation.fichier.split(',').map((file, index) => (
                  <FileItem
                    key={index}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadFile(file.trim());
                    }}
                  >
                    <FaDownload /> {file.trim()}
                  </FileItem>
                ))}
              </FileList>
            </FilesSection>
          )}
        </PresentationSection>

        <CommentsSection>
          <SectionTitle>
            <FaComment /> Commentaires ({comments.length})
          </SectionTitle>

          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              Aucun commentaire
            </div>
          ) : (
            comments.map(comment => (
              <CommentItem key={comment.idCommentaire}>
                <CommentHeader>
                  <CommentAuthor>
                    {comment.utilisateur ? `${comment.utilisateur.prenom} ${comment.utilisateur.nom}` : 'Utilisateur'}
                  </CommentAuthor>
                </CommentHeader>
                <CommentContent>{comment.contenu}</CommentContent>
              </CommentItem>
            ))
          )}

          <AddCommentSection>
            <InfoLabel>Ajouter un commentaire</InfoLabel>
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Votre commentaire..."
              disabled={isAddingComment}
            />
            <Button
              onClick={handleAddComment}
              disabled={isAddingComment}
              style={{ marginTop: '1rem' }}
            >
              {isAddingComment ? 'Envoi...' : 'Publier'}
            </Button>
          </AddCommentSection>
        </CommentsSection>

        <VotesSection>
          <SectionTitle>
            <FaStar /> Votes ({votes.length})
          </SectionTitle>

          {votes.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              Aucun vote
            </div>
          ) : (
            votes.map(vote => (
              <VoteItem key={vote.idVote}>
                <VoteInfo>
                  <FaUser style={{ color: '#FF6B1A' }} />
                  <span style={{ fontWeight: 'bold', color: '#FF6B1A' }}>
                    {vote.utilisateur ? `${vote.utilisateur.prenom} ${vote.utilisateur.nom}` : 'Utilisateur'}
                  </span>
                </VoteInfo>
                <VoteRating>
                  <FaStar />
                  {vote.note}/5
                </VoteRating>
              </VoteItem>
            ))
          )}

          <AddVoteSection>
            <InfoLabel>Voter pour cette présentation</InfoLabel>
            <StarRating>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  $filled={star <= newVote}
                  onClick={() => setNewVote(star)}
                />
              ))}
            </StarRating>
            <Button
              onClick={handleAddVote}
              disabled={isVoting || newVote === 0}
            >
              {isVoting ? 'Envoi...' : 'Voter'}
            </Button>
          </AddVoteSection>
        </VotesSection>
      </Content>
    </Container>
  );
};

export default DetailPresentation;