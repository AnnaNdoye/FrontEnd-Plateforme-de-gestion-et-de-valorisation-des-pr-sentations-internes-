import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaList, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaEdit, FaTrash, FaPlus, FaStar } from 'react-icons/fa';
import Barre from './Barre';
import Recherche from './Recherche';
import presentationService from '../../services/presentationService';

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
  box-shadow: 0 4px 20px rgba(255, 140, 66, 0.1);
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

const StatusSection = styled.div`
  margin-bottom: 2rem;
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #FF6B1A;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#FF8C42'};
`;

const PresentationList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PresentationCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => props.statusColor};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(255, 140, 66, 0.3);
    transform: translateY(-2px);
  }
`;

const CardActions = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 6px;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: ${props => props.danger ? '#ffebee' : '#e8f5e8'};
    color: ${props => props.danger ? '#dc3545' : '#28a745'};
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const PresentationTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  padding-right: 80px;
`;

const PresentationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  strong {
    color: #333;
  }
`;

const PresentationStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  background-color: ${props => props.statusColor};
  display: inline-block;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #666;

  svg {
    color: #FFD700;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 8px;

  svg {
    font-size: 3rem;
    color: #FF8C42;
    margin-bottom: 1rem;
  }
`;

const PresentationsPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [filteredPresentations, setFilteredPresentations] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    sujet: '',
    description: '',
    datePresentation: '',
    heureDebut: '',
    heureFin: '',
    statut: 'Planifié',
    fichiers: []
  });
  const [presentationStats, setPresentationStats] = useState({});

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    loadPresentations();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUser({ idUtilisateur: parseInt(userId) });
    }
  };

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const data = await presentationService.getAllPresentations();
      setPresentations(data);
      setFilteredPresentations(data);

      // Charger les stats pour chaque présentation
      const statsPromises = data.map(p => 
        presentationService.getPresentationStats(p.idPresentation)
          .then(stats => ({ id: p.idPresentation, stats }))
          .catch(() => ({ id: p.idPresentation, stats: { nombreVotes: 0, moyenneVotes: 0, nombreCommentaires: 0 } }))
      );
      const statsResults = await Promise.all(statsPromises);
      const statsMap = {};
      statsResults.forEach(({ id, stats }) => {
        statsMap[id] = stats;
      });
      setPresentationStats(statsMap);
    } catch (error) {
      console.error('Erreur lors du chargement des présentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (term === '') {
      setFilteredPresentations(presentations);
    } else {
      setFilteredPresentations(presentations.filter(p =>
        p.sujet.toLowerCase().includes(term.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(term.toLowerCase())) ||
        (p.utilisateur && 
          (`${p.utilisateur.prenom} ${p.utilisateur.nom}`.toLowerCase().includes(term.toLowerCase()) ||
            p.utilisateur.departement.toLowerCase().includes(term.toLowerCase())))
      ));
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Planifié': return <FaClock />;
      case 'Confirmé': return <FaCheckCircle />;
      case 'Terminé': return <FaCheckCircle />;
      case 'Annulé': return <FaTimesCircle />;
      default: return <FaCalendarAlt />;
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

  const groupedPresentations = filteredPresentations.reduce((acc, presentation) => {
    if (!acc[presentation.statut]) {
      acc[presentation.statut] = [];
    }
    acc[presentation.statut].push(presentation);
    return acc;
  }, {});

  const statusOrder = ['Planifié', 'Confirmé', 'Terminé', 'Annulé'];

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openDetails = (presentation) => {
    navigate(`/plateforme/detail-presentation/${presentation.idPresentation}`);
  };

  const handleEdit = (presentation) => {
    setEditingPresentation(presentation);
    setFormData({
      sujet: presentation.sujet,
      description: presentation.description || '',
      datePresentation: presentation.datePresentation,
      heureDebut: formatTimeForInput(presentation.heureDebut),
      heureFin: formatTimeForInput(presentation.heureFin),
      statut: presentation.statut,
      fichiers: []
    });
    setShowForm(true);
  };

  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDelete = async (presentation) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
      try {
        await presentationService.deletePresentation(presentation.idPresentation);
        await loadPresentations();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la présentation');
      }
    }
  };

  const handleSavePresentation = async () => {
    if (!formData.sujet || !formData.datePresentation || !formData.heureDebut || !formData.heureFin) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    try {
      const heureDebut = formData.heureDebut.includes('T') 
        ? formData.heureDebut + ':00'
        : `${formData.datePresentation}T${formData.heureDebut}:00`;
      const heureFin = formData.heureFin.includes('T') 
        ? formData.heureFin + ':00'
        : `${formData.datePresentation}T${formData.heureFin}:00`;

      const dataToSend = {
        ...formData,
        heureDebut,
        heureFin
      };

      if (editingPresentation) {
        await presentationService.updatePresentation(editingPresentation.idPresentation, dataToSend, formData.fichiers);
      } else {
        await presentationService.createPresentation(dataToSend, formData.fichiers);
      }
      
      await loadPresentations();
      setShowForm(false);
      setEditingPresentation(null);
      setFormData({
        sujet: '',
        description: '',
        datePresentation: '',
        heureDebut: '',
        heureFin: '',
        statut: 'Planifié',
        fichiers: []
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la présentation: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleNewPresentation = () => {
    setEditingPresentation(null);
    setFormData({
      sujet: '',
      description: '',
      datePresentation: '',
      heureDebut: '',
      heureFin: '',
      statut: 'Planifié',
      fichiers: []
    });
    setShowForm(true);
  };

  const downloadFile = (fileName) => {
    window.open(`http://localhost:8080/uploads/presentations/${fileName}`, '_blank');
  };

  return (
    <Container>
      {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
      <Content>
        <Header>
          <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
          <h1>Présentations</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={handleNewPresentation} style={{ 
              padding: '8px 16px', 
              backgroundColor: '#FF8C42', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              <FaPlus /> Nouvelle
            </button>
          </div>
        </Header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Chargement des présentations...</div>
        ) : (
          <>
            <Recherche onSearch={handleSearch} />

            {statusOrder.map(status => (
              groupedPresentations[status] && (
                <StatusSection key={status}>
                  <StatusHeader color={getStatusColor(status)}>
                    {getStatusIcon(status)}
                    {status} ({groupedPresentations[status].length})
                  </StatusHeader>
                  <PresentationList>
                    {groupedPresentations[status].map(presentation => {
                      const stats = presentationStats[presentation.idPresentation] || { nombreVotes: 0, moyenneVotes: 0, nombreCommentaires: 0 };
                      return (
                        <PresentationCard 
                          key={presentation.idPresentation} 
                          statusColor={getStatusColor(status)}
                          onClick={() => openDetails(presentation)}
                        >
                          {currentUser && presentation.utilisateur && currentUser.idUtilisateur === presentation.utilisateur.idUtilisateur && (
                            <CardActions>
                              <ActionButton onClick={(e) => { e.stopPropagation(); handleEdit(presentation); }}>
                                <FaEdit />
                              </ActionButton>
                              <ActionButton danger onClick={(e) => { e.stopPropagation(); handleDelete(presentation); }}>
                                <FaTrash />
                              </ActionButton>
                            </CardActions>
                          )}
                          <PresentationTitle>{presentation.sujet}</PresentationTitle>
                          <p style={{ color: '#666', marginBottom: '1rem' }}>{presentation.description}</p>
                          <PresentationInfo>
                            <InfoRow>
                              <strong>Date:</strong> {formatDate(presentation.datePresentation)}
                            </InfoRow>
                            {presentation.utilisateur && (
                              <>
                                <InfoRow>
                                  <strong>Présentateur:</strong> {presentation.utilisateur.prenom} {presentation.utilisateur.nom}
                                </InfoRow>
                                <InfoRow>
                                  <strong>Département:</strong> {presentation.utilisateur.departement}
                                </InfoRow>
                              </>
                            )}
                            <InfoRow>
                              <strong>Statut:</strong> <PresentationStatus statusColor={getStatusColor(status)}>{status}</PresentationStatus>
                            </InfoRow>
                          </PresentationInfo>
                          <StatsRow>
                            <StatBadge>
                              <FaStar /> {stats.moyenneVotes ? stats.moyenneVotes.toFixed(1) : '0.0'}/5 ({stats.nombreVotes} votes)
                            </StatBadge>
                            <StatBadge>
                              💬 {stats.nombreCommentaires} commentaire{stats.nombreCommentaires > 1 ? 's' : ''}
                            </StatBadge>
                          </StatsRow>
                        </PresentationCard>
                      );
                    })}
                  </PresentationList>
                </StatusSection>
              )
            ))}

            {filteredPresentations.length === 0 && (
              <EmptyState>
                <FaList />
                <h3>Aucune présentation trouvée</h3>
                <p>Commencez par créer une nouvelle présentation</p>
              </EmptyState>
            )}
          </>
        )}



        {/* Modal Formulaire */}
        {showForm && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px', 
              maxWidth: '600px', 
              width: '100%',
              maxHeight: '90vh', 
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ color: '#FF6B1A', marginBottom: '1.5rem' }}>
                {editingPresentation ? 'Modifier la présentation' : 'Nouvelle présentation'}
              </h2>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Sujet <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.sujet} 
                  onChange={(e) => setFormData({...formData, sujet: e.target.value})} 
                  style={inputStyle}
                  placeholder="Titre de la présentation"
                  required 
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Description
                </label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  placeholder="Description détaillée"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.datePresentation}
                  onChange={(e) => setFormData({...formData, datePresentation: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Heure de début <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="time"
                  value={formData.heureDebut}
                  onChange={(e) => setFormData({...formData, heureDebut: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Heure de fin <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="time"
                  value={formData.heureFin}
                  onChange={(e) => setFormData({...formData, heureFin: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Statut <span style={{ color: 'red' }}>*</span>
                </label>
                <select 
                  value={formData.statut} 
                  onChange={(e) => setFormData({...formData, statut: e.target.value})} 
                  style={inputStyle}
                  required
                >
                  <option value="Planifié">Planifié</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Fichiers (optionnel)
                </label>
                <input 
                  type="file" 
                  multiple 
                  onChange={(e) => setFormData({...formData, fichiers: Array.from(e.target.files)})} 
                  style={inputStyle}
                />
                {formData.fichiers.length > 0 && (
                  <ul style={{ marginTop: '10px', paddingLeft: '20px', backgroundColor: '#FFF8F0', borderRadius: '6px', padding: '10px' }}>
                    {formData.fichiers.map((file, index) => (
                      <li key={index} style={{ color: '#FF6B1A', fontWeight: 'bold' }}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <button 
                  onClick={() => { 
                    setShowForm(false); 
                    setEditingPresentation(null); 
                    setFormData({
                      sujet: '',
                      description: '',
                      datePresentation: '',
                      heureDebut: '',
                      heureFin: '',
                      statut: 'Planifié',
                      fichiers: []
                    });
                  }} 
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSavePresentation} 
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#FF8C42', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {editingPresentation ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Content>
    </Container>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '2px solid #FFE5CC',
  borderRadius: '8px',
  fontSize: '1rem',
  transition: 'border-color 0.3s ease',
  backgroundColor: '#FFF8F0',
  boxSizing: 'border-box'
};

export default PresentationsPage;