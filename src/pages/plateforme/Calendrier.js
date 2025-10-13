import { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { FaList, FaChevronLeft, FaChevronRight, FaCalendarDay } from 'react-icons/fa';
import Barre from './Barre';

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

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'fr': fr,
  },
});



const Calendrier = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    presentationDate: '',
    startTime: '',
    subject: '',
    description: '',
    status: 'Planifié',
    files: [],
  });

  // Date constraints
  // Remove minDate and maxDate as they are incorrectly used for min and max props in Calendar
  // const minDate = new Date(2025, 8, 30); // September 30, 2025 (months are 0-indexed)
  // const maxDate = new Date(2099, 11, 31); // December 31, 2099

  const handleSelectSlot = useCallback((slotInfo) => {
    // slotInfo contains start and end of selected slot
    setEventForm({
      presentationDate: slotInfo.start ? format(slotInfo.start, 'yyyy-MM-dd') : '',
      startTime: slotInfo.start ? format(slotInfo.start, 'HH:mm') : '',
      subject: '',
      description: '',
      status: 'Planifié',
      files: [],
    });
    setShowEventForm(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    // Extract date and time from event.start
    const start = event.start;
    const presentationDate = start ? format(start, 'yyyy-MM-dd') : '';
    const startTime = start ? format(start, 'HH:mm') : '';
    setEventForm({
      presentationDate,
      startTime,
      subject: event.subject || event.title || '',
      description: event.description || '',
      status: event.status || 'Planifié',
      files: event.files || [],
    });
    setShowEventForm(true);
  }, []);

  const handleSaveEvent = () => {
    const { presentationDate, startTime, subject, description, status } = eventForm;
    if (presentationDate && startTime && subject && description && status) {
      // Combine presentationDate and startTime into a Date object
      const start = new Date(`${presentationDate}T${startTime}`);
      // For simplicity, set end to start + 1 hour
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      if (selectedEvent) {
        // Update existing event
        setEvents(events.map(evt =>
          evt.id === selectedEvent.id
            ? { ...evt, title: subject, start, end, subject, description, status, files: eventForm.files }
            : evt
        ));
      } else {
        // Add new event
        const newEvent = {
          id: Date.now(),
          title: subject,
          start,
          end,
          subject,
          description,
          status,
          files: eventForm.files,
        };
        setEvents([...events, newEvent]);
      }
      setShowEventForm(false);
      setSelectedEvent(null);
      setEventForm({
        presentationDate: '',
        startTime: '',
        subject: '',
        description: '',
        status: 'Planifié',
        files: [],
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire.');
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(evt => evt.id !== selectedEvent.id));
      setShowEventForm(false);
      setSelectedEvent(null);
      setEventForm({
        presentationDate: '',
        startTime: '',
        subject: '',
        description: '',
        status: 'Planifié',
        files: [],
      });
    }
  };

  const handleCancel = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setEventForm({
      presentationDate: '',
      startTime: '',
      subject: '',
      description: '',
      status: 'Planifié',
      files: [],
    });
  };

  const handleFileChange = (e) => {
    setEventForm({ ...eventForm, files: Array.from(e.target.files) });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Custom toolbar component to reorder navigation buttons
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
          <button
            onClick={goToPrevious}
            style={{
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
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#FF6B1A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FF8C42'}
          >
            <FaChevronLeft /> Précédent
          </button>

          <button
            onClick={goToToday}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FF6B1A',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#E55A00'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FF6B1A'}
          >
            <FaCalendarDay /> Aujourd'hui
          </button>

          <button
            onClick={goToNext}
            style={{
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
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#FF6B1A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FF8C42'}
          >
            Suivant <FaChevronRight />
          </button>
        </div>

        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FF6B1A',
          textAlign: 'center',
          flex: 1
        }}>
          {label}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {['month', 'week', 'day'].map(view => (
            <button
              key={view}
              onClick={() => onView(view)}
              style={{
                padding: '6px 10px',
                backgroundColor: '#FFE5CC',
                color: '#FF6B1A',
                border: '1px solid #FF8C42',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#FF8C42';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#FFE5CC';
                e.target.style.color = '#FF6B1A';
              }}
            >
              {view === 'month' ? 'Mois' : view === 'week' ? 'Semaine' : 'Jour'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Container>
      {isMenuOpen && <Barre isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />}
      <Content>
        <Header>
          <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
        </Header>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowEventForm(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #FF6B1A 0%, #E55A00 100%)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #FF8C42 0%, #FF6B1A 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(255, 140, 66, 0.3)';
            }}
          >
            Ajouter une présentation
          </button>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          views={['month', 'week', 'day']}
          defaultView="month"
          culture="fr"
          components={{
            toolbar: CustomToolbar,
          }}
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
            zIndex: 1000
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%)',
              padding: '30px',
              borderRadius: '16px',
              width: '700px',
              maxWidth: '90%',
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
              }}>{selectedEvent ? 'Modifier la présentation' : 'Nouvelle présentation'}</h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Date de présentation:</label>
                <input
                  type="date"
                  value={eventForm.presentationDate}
                  onChange={(e) => setEventForm({ ...eventForm, presentationDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #FFE5CC',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#FFF8F0'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5CC'}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Heure de début:</label>
                <input
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #FFE5CC',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#FFF8F0'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5CC'}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Sujet:</label>
                <input
                  type="text"
                  value={eventForm.subject}
                  onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #FFE5CC',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#FFF8F0'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5CC'}
                  placeholder="Sujet de la présentation"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Description:</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #FFE5CC',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#FFF8F0',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5CC'}
                  placeholder="Description de la présentation"
                  rows={3}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Statut:</label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #FFE5CC',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#FFF8F0'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5CC'}
                >
                  <option value="Planifié">Planifié</option>
                  <option value="Annulé">Annulé</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#FF6B1A' }}>Fichiers:</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #FFE5CC',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#FFF8F0'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                  onBlur={(e) => e.target.style.borderColor = '#FFE5CC'}
                />
                {eventForm.files.length > 0 && (
                  <ul style={{
                    marginTop: '10px',
                    maxHeight: '100px',
                    overflowY: 'auto',
                    paddingLeft: '20px',
                    backgroundColor: '#FFF8F0',
                    borderRadius: '6px',
                    padding: '10px'
                  }}>
                    {eventForm.files.map((file, index) => (
                      <li key={index} style={{ fontSize: '0.9rem', color: '#FF6B1A', fontWeight: 'bold' }}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancel}
                  style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
                >
                  Annuler
                </button>
                {selectedEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
                  >
                    Supprimer
                  </button>
                )}
                <button
                  onClick={handleSaveEvent}
                  style={{ padding: '10px 20px', backgroundColor: '#FF8113', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem' }}
                >
                  {selectedEvent ? 'Modifier' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Content>
    </Container>
  );
};

export default Calendrier;
