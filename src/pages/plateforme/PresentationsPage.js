import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaList, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Barre from './Barre';
import Recherche from './Recherche';
import presentationService from '../../services/presentationService';

const Container = styled.div`
  display: flex;
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
`;

const PresentationList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PresentationCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'Planifié': return '#FF8C42';
      case 'Confirmé': return '#28a745';
      case 'Terminé': return '#007bff';
      case 'Annulé': return '#dc3545';
      default: return '#FF8C42';
    }
  }};
  position: relative;
`;

const CardActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  color: #666;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: ${props => props.danger ? '#dc3545' : '#FF8C42'};
  }
`;

const PresentationTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const PresentationDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const PresentationDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const PresentationStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch(props.status) {
      case 'Planifié': return '#FF8C42';
      case 'Confirmé': return '#28a745';
      case 'Terminé': return '#007bff';
      case 'Annulé': return '#dc3545';
      default: return '#FF8C42';
    }
  }};
`;

const PresentationsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [filteredPresentations, setFilteredPresentations] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [editingPresentation, setEditingPresentation] = useState(null);
  const [formData, setFormData] = useState({
    sujet: '',
    description: '',
    datePresentation: '',
    heureDebut: '',
    heureFin: '',
    statut: 'Planifié',
    fichiers: []
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Load presentations on component mount
  useEffect(() => {
    const loadPresentations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }



        const data = await presentationService.getMyPresentations();
        setPresentations(data);
        setFilteredPresentations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des présentations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPresentations();
  }, []);

  const handleSearch = (term) => {
    if (term === '') {
      setFilteredPresentations(presentations);
    } else {
      setFilteredPresentations(presentations.filter(p =>
        p.sujet.toLowerCase().includes(term.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(term.toLowerCase()))
      ));
    }
  };

  // Remove dummy data - now loaded from API

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Planifié': return <FaClock />;
      case 'Confirmé': return <FaCheckCircle />;
      case 'Terminé': return <FaCheckCircle />;
      case 'Annulé': return <FaTimesCircle />;
      default: return <FaCalendarAlt />;
    }
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
    return date.toTimeString().slice(0, 5);
  };

  const openDetails = (presentation) => {
    setSelectedPresentation(presentation);
    setShowModal(true);
  };

  const handleEdit = (presentation) => {
    setEditingPresentation(presentation);
    setFormData({
      sujet: presentation.sujet,
      description: presentation.description || '',
      datePresentation: presentation.datePresentation,
      heureDebut: formatTime(presentation.heureDebut),
      heureFin: formatTime(presentation.heureFin),
      statut: presentation.statut,
      fichiers: []
    });
    setShowForm(true);
    setShowModal(false);
  };

  const handleDelete = async (presentation) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
      try {
        await presentationService.deletePresentation(presentation.idPresentation);
        const data = await presentationService.getMyPresentations();
        setPresentations(data);
        setFilteredPresentations(data);
        if (selectedPresentation && selectedPresentation.idPresentation === presentation.idPresentation) {
          setShowModal(false);
          setSelectedPresentation(null);
        }
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
      if (editingPresentation) {
        await presentationService.updatePresentation(editingPresentation.idPresentation, formData);
      } else {
        await presentationService.createPresentation(formData);
      }
      const data = await presentationService.getMyPresentations();
      setPresentations(data);
      setFilteredPresentations(data);
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
      alert('Erreur lors de la sauvegarde de la présentation');
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

  return (
    <Container>
      {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
      <Content>
        <Header>
          <h1>Présentations</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={handleNewPresentation} style={{ padding: '8px 16px', backgroundColor: '#FF8C42', color: 'white', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaPlus /> Nouvelle
            </button>
            <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
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
                  <StatusHeader>
                    {getStatusIcon(status)}
                    {status} ({groupedPresentations[status].length})
                  </StatusHeader>
                  <PresentationList>
                    {groupedPresentations[status].map(presentation => (
                      <PresentationCard key={presentation.idPresentation} status={status} onClick={() => openDetails(presentation)}>
                        <CardActions>
                          <ActionButton onClick={(e) => { e.stopPropagation(); handleEdit(presentation); }}>
                            <FaEdit />
                          </ActionButton>
                          <ActionButton danger onClick={(e) => { e.stopPropagation(); handleDelete(presentation); }}>
                            <FaTrash />
                          </ActionButton>
                        </CardActions>
                        <PresentationTitle>{presentation.sujet}</PresentationTitle>
                        <p>{presentation.description}</p>
                        <PresentationDetails>
                          <PresentationDate>
                            {presentation.datePresentation} à {formatTime(presentation.heureDebut)} - {formatTime(presentation.heureFin)}
                          </PresentationDate>
                          <PresentationStatus status={status}>
                            {status}
                          </PresentationStatus>
                        </PresentationDetails>
                      </PresentationCard>
                    ))}
                  </PresentationList>
                </StatusSection>
              )
            ))}
          </>
        )}

        {/* Modal Détails */}
        {showModal && selectedPresentation && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h2>Détails de la présentation</h2>
              <p><strong>Sujet:</strong> {selectedPresentation.sujet}</p>
              <p><strong>Description:</strong> {selectedPresentation.description || 'Aucune description'}</p>
              <p><strong>Date:</strong> {selectedPresentation.datePresentation}</p>
              <p><strong>Heure:</strong> {formatTime(selectedPresentation.heureDebut)} - {formatTime(selectedPresentation.heureFin)}</p>
              <p><strong>Statut:</strong> {selectedPresentation.statut}</p>
              {selectedPresentation.fichiers && selectedPresentation.fichiers.trim() && (
                <div>
                  <strong>Fichiers:</strong>
                  <ul>
                    {selectedPresentation.fichiers.split(',').map((file, index) => (
                      <li key={index}>
                        <a href={`/uploads/presentations/${file.trim()}`} target="_blank" rel="noopener noreferrer">
                          {file.trim()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={() => { setShowModal(false); setSelectedPresentation(null); }} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px' }}>
                  Fermer
                </button>
                <button onClick={() => handleEdit(selectedPresentation)} style={{ padding: '10px 20px', backgroundColor: '#FF8C42', color: 'white', border: 'none', borderRadius: '6px' }}>
                  Modifier
                </button>
                <button onClick={() => handleDelete(selectedPresentation)} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px' }}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Formulaire */}
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h2>{editingPresentation ? 'Modifier la présentation' : 'Nouvelle présentation'}</h2>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Sujet:</label>
                <input 
                  type="text" 
                  value={formData.sujet} 
                  onChange={(e) => setFormData({...formData, sujet: e.target.value})} 
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE5CC', borderRadius: '8px', fontSize: '1rem' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Description:</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE5CC', borderRadius: '8px', height: '100px', fontSize: '1rem' }} 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Date:</label>
                <input 
                  type="date" 
                  value={formData.datePresentation} 
                  onChange={(e) => setFormData({...formData, datePresentation: e.target.value})} 
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE5CC', borderRadius: '8px', fontSize: '1rem' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Heure début:</label>
                <input 
                  type="time" 
                  value={formData.heureDebut} 
                  onChange={(e) => setFormData({...formData, heureDebut: e.target.value})} 
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE5CC', borderRadius: '8px', fontSize: '1rem' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Heure fin:</label>
                <input 
                  type="time" 
                  value={formData.heureFin} 
                  onChange={(e) => setFormData({...formData, heureFin: e.target.value})} 
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE5CC', borderRadius: '8px', fontSize: '1rem' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Statut:</label>
                <select 
                  value={formData.statut} 
                  onChange={(e) => setFormData({...formData, statut: e.target.value})} 
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE5CC', borderRadius: '8px', fontSize: '1rem' }} 
                >
                  <option value="Planifié">Planifié</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Fichiers (optionnel):</label>
                <input 
                  type="file" 
                  multiple 
                  onChange={(e) => setFormData({...formData, fichiers: Array.from(e.target.files)})} 
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE5CC', borderRadius: '8px', fontSize: '1rem' }} 
                />
                {formData.fichiers.length > 0 && (
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {formData.fichiers.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
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
                  style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSavePresentation} 
                  style={{ padding: '10px 20px', backgroundColor: '#FF8C42', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
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

export default PresentationsPage;
