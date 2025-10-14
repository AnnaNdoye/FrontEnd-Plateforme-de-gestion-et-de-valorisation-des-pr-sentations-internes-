import { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { FaList, FaChevronLeft, FaChevronRight, FaCalendarDay } from 'react-icons/fa';
import Barre from './Barre';
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

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'fr': fr },
});

const Calendrier = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    datePresentation: '',
    heureDebut: '',
    heureFin: '',
    sujet: '',
    description: '',
    statut: 'Planifié',
    fichiers: [],
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const userIdFromStorage = localStorage.getItem('userId');
      if (!userIdFromStorage) {
        console.error('No user ID found');
        return;
      }
      setUserId(parseInt(userIdFromStorage));

      const presentations = await presentationService.getMyPresentations();
      const formattedEvents = presentationService.formatPresentationsForCalendar(presentations);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des présentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = useCallback((slotInfo) => {
    const startDateTime = slotInfo.start;
    const endDateTime = slotInfo.end || new Date(startDateTime.getTime() + 60 * 60 * 1000);

    // Format: yyyy-MM-dd
    const dateStr = format(startDateTime, 'yyyy-MM-dd');
    // Format: yyyy-MM-ddTHH:mm:ss
    const startStr = format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss");
    const endStr = format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss");

    setEventForm({
      datePresentation: dateStr,
      heureDebut: startStr,
      heureFin: endStr,
      sujet: '',
      description: '',
      statut: 'Planifié',
      fichiers: [],
    });
    setShowEventForm(true);
    setSelectedEvent(null);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);

    const start = event.start;
    const end = event.end;
    const datePresentation = start ? format(start, 'yyyy-MM-dd') : '';
    const heureDebut = start ? format(start, "yyyy-MM-dd'T'HH:mm:ss") : '';
    const heureFin = end ? format(end, "yyyy-MM-dd'T'HH:mm:ss") : '';

    setEventForm({
      datePresentation,
      heureDebut,
      heureFin,
      sujet: event.subject || event.title || '',
      description: event.description || '',
      statut: event.status || event.statut || 'Planifié',
      fichiers: [],
    });
    setShowEventForm(true);
  }, []);

  const handleSaveEvent = async () => {
    const { datePresentation, heureDebut, heureFin, sujet, description, statut, fichiers } = eventForm;

    if (!datePresentation || !heureDebut || !heureFin || !sujet || !statut || !userId) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);

      const presentationData = {
        datePresentation,
        heureDebut,
        heureFin,
        sujet,
        description,
        statut
      };

      if (selectedEvent) {
        await presentationService.updatePresentation(selectedEvent.id, presentationData, fichiers);
      } else {
        await presentationService.createPresentation(presentationData, fichiers);
      }

      await loadPresentations();

      setShowEventForm(false);
      setSelectedEvent(null);
      setEventForm({
        datePresentation: '',
        heureDebut: '',
        heureFin: '',
        sujet: '',
        description: '',
        statut: 'Planifié',
        fichiers: [],
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la présentation: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && window.confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
      try {
        setLoading(true);
        await presentationService.deletePresentation(selectedEvent.id);
        await loadPresentations();

        setShowEventForm(false);
        setSelectedEvent(null);
        setEventForm({
          datePresentation: '',
          heureDebut: '',
          heureFin: '',
          sujet: '',
          description: '',
          statut: 'Planifié',
          fichiers: [],
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la présentation');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setEventForm({
      datePresentation: '',
      heureDebut: '',
      heureFin: '',
      sujet: '',
      description: '',
      statut: 'Planifié',
      fichiers: [],
    });
  };

  const handleFileChange = (e) => {
    setEventForm({ ...eventForm, fichiers: Array.from(e.target.files) });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => {
    const goToToday = () => onNavigate('TODAY');
    const goToPrevious = () => onNavigate('PREV');
    const goToNext = () => onNavigate('NEXT');

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px 0',
        borderBottom: '2px solid #FF8C42',
        backgroundColor: '#FFF8F0'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={goToPrevious} style={buttonStyle}>
            <FaChevronLeft /> Précédent
          </button>
          <button onClick={goToToday} style={todayButtonStyle}>
            <FaCalendarDay /> Aujourd'hui
          </button>
          <button onClick={goToNext} style={buttonStyle}>
            Suivant <FaChevronRight />
          </button>
        </div>

        <div style={labelStyle}>{label}</div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {['month', 'week', 'day'].map(view => (
            <button key={view} onClick={() => onView(view)} style={viewButtonStyle}>
              {view === 'month' ? 'Mois' : view === 'week' ? 'Semaine' : 'Jour'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#FF8C42',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
    fontWeight: 'bold'
  };

  const todayButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#FF6B1A'
  };

  const labelStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FF6B1A',
    textAlign: 'center',
    flex: 1
  };

  const viewButtonStyle = {
    padding: '6px 10px',
    backgroundColor: '#FFE5CC',
    color: '#FF6B1A',
    border: '1px solid #FF8C42',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  };

  return (
    <Container>
      {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
      <Content>
        <Header>
          <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
          <h1 style={{ margin: 0 }}>Calendrier des Présentations</h1>
        </Header>

        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setShowEventForm(true)} style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Ajouter une présentation
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>Chargement des présentations...</div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(255, 140, 66, 0.1)' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              views={['month', 'week', 'day']}
              defaultView="month"
              culture="fr"
              components={{
                toolbar: CustomToolbar,
              }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: presentationService.getStatusColor(event.statut || event.status),
                  borderRadius: '5px',
                  opacity: 0.9,
                  color: 'white',
                  border: '0px',
                  display: 'block'
                }
              })}
              messages={{
                allDay: 'Toute la journée',
                previous: 'Précédent',
                next: 'Suivant',
                today: 'Aujourd\'hui',
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                agenda: 'Agenda',
                date: 'Date',
                time: 'Heure',
                event: 'Événement',
                noEventsInRange: 'Aucun événement dans cette période.',
                showMore: (total) => `+ ${total} de plus`,
              }}
            />
          </div>
        )}

        {showEventForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%)',
              padding: '30px',
              borderRadius: '16px',
              width: '700px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(255, 140, 66, 0.3)',
              border: '2px solid #FF8C42',
            }}>
              <h3 style={{
                marginBottom: '20px',
                fontSize: '1.8rem',
                color: '#FF6B1A',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                {selectedEvent ? 'Modifier la présentation' : 'Nouvelle présentation'}
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Date de présentation <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={eventForm.datePresentation}
                  onChange={(e) => setEventForm({ ...eventForm, datePresentation: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Heure de début <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="datetime-local"
                  value={eventForm.heureDebut}
                  onChange={(e) => setEventForm({ ...eventForm, heureDebut: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Heure de fin <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="datetime-local"
                  value={eventForm.heureFin}
                  onChange={(e) => setEventForm({ ...eventForm, heureFin: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Sujet <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={eventForm.sujet}
                  onChange={(e) => setEventForm({ ...eventForm, sujet: e.target.value })}
                  style={inputStyle}
                  placeholder="Sujet de la présentation"
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  style={{...inputStyle, resize: 'vertical', minHeight: '80px'}}
                  placeholder="Description de la présentation"
                  rows={3}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Statut <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={eventForm.statut}
                  onChange={(e) => setEventForm({ ...eventForm, statut: e.target.value })}
                  style={inputStyle}
                  required
                >
                  <option value="Planifié">Planifié</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>
                  Fichiers
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={inputStyle}
                />
                {eventForm.fichiers.length > 0 && (
                  <ul style={{
                    marginTop: '10px',
                    maxHeight: '100px',
                    overflowY: 'auto',
                    paddingLeft: '20px',
                    backgroundColor: '#FFF8F0',
                    borderRadius: '6px',
                    padding: '10px'
                  }}>
                    {eventForm.fichiers.map((file, index) => (
                      <li key={index} style={{ fontSize: '0.9rem', color: '#FF6B1A', fontWeight: 'bold' }}>
                        {file.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancel}
                  style={{ ...formButtonStyle, backgroundColor: '#6c757d' }}
                  disabled={loading}
                >
                  Annuler
                </button>
                {selectedEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    style={{ ...formButtonStyle, backgroundColor: '#dc3545' }}
                    disabled={loading}
                  >
                    {loading ? 'Suppression...' : 'Supprimer'}
                  </button>
                )}
                <button
                  onClick={handleSaveEvent}
                  style={{ ...formButtonStyle, backgroundColor: '#FF8113' }}
                  disabled={loading}
                >
                  {loading ? 'Sauvegarde...' : (selectedEvent ? 'Modifier' : 'Enregistrer')}
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

const formButtonStyle = {
  padding: '10px 20px',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'opacity 0.2s'
};

export default Calendrier;
