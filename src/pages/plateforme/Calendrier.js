import { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { FaList } from 'react-icons/fa';
import Barre from './Barre';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
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
    title: '',
    start: null,
    end: null,
  });

  // Date constraints
  const minDate = new Date(2025, 8, 30); // September 30, 2025 (months are 0-indexed)
  const maxDate = new Date(2099, 11, 31); // December 31, 2099

  const handleSelectSlot = useCallback(({ start, end }) => {
    setEventForm({
      title: '',
      start,
      end,
    });
    setShowEventForm(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      start: event.start,
      end: event.end,
    });
    setShowEventForm(true);
  }, []);

  const handleSaveEvent = () => {
    if (eventForm.title && eventForm.start && eventForm.end) {
      if (selectedEvent) {
        // Update existing event
        setEvents(events.map(evt =>
          evt.id === selectedEvent.id
            ? { ...evt, title: eventForm.title, start: eventForm.start, end: eventForm.end }
            : evt
        ));
      } else {
        // Add new event
        const newEvent = {
          id: Date.now(),
          title: eventForm.title,
          start: eventForm.start,
          end: eventForm.end,
        };
        setEvents([...events, newEvent]);
      }
      setShowEventForm(false);
      setSelectedEvent(null);
      setEventForm({ title: '', start: null, end: null });
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(evt => evt.id !== selectedEvent.id));
      setShowEventForm(false);
      setSelectedEvent(null);
      setEventForm({ title: '', start: null, end: null });
    }
  };

  const handleCancel = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setEventForm({ title: '', start: null, end: null });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    
    <Container>
        {isMenuOpen && <Barre />}
      <Content>
        <Header>
        <FaList onClick={toggleMenu} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ff8113' }} />
        </Header>
      <h1>Calendrier des Réunions</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowEventForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#FF8113', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Ajouter une réunion
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
        min={minDate}
        max={maxDate}
        views={['month', 'week', 'day']}
        defaultView="month"
        culture="fr"
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
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3>{selectedEvent ? 'Modifier la réunion' : 'Nouvelle réunion'}</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Titre:</label>
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Titre de la réunion"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Date de début:</label>
              <input
                type="datetime-local"
                value={eventForm.start ? format(eventForm.start, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setEventForm({...eventForm, start: new Date(e.target.value)})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Date de fin:</label>
              <input
                type="datetime-local"
                value={eventForm.end ? format(eventForm.end, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setEventForm({...eventForm, end: new Date(e.target.value)})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Annuler
              </button>
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Supprimer
                </button>
              )}
              <button
                onClick={handleSaveEvent}
                style={{ padding: '8px 16px', backgroundColor: '#FF8113', color: 'white', border: 'none', borderRadius: '4px' }}
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

