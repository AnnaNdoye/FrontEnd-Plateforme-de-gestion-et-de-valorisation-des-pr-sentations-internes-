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
    presentationDate: '',
    startTime: '',
    subject: '',
    description: '',
    status: 'Planifié',
  });

  // Date constraints
  const minDate = new Date(2025, 8, 30); // September 30, 2025 (months are 0-indexed)
  const maxDate = new Date(2099, 11, 31); // December 31, 2099

  const handleSelectSlot = useCallback(() => {
    setEventForm({
      presentationDate: '',
      startTime: '',
      subject: '',
      description: '',
      status: 'Planifié',
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
            ? { ...evt, title: subject, start, end, subject, description, status }
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
    });
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
                <label style={{ display: 'block', marginBottom: '5px' }}>Date de présentation:</label>
                <input
                  type="date"
                  value={eventForm.presentationDate}
                  onChange={(e) => setEventForm({ ...eventForm, presentationDate: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Heure de début:</label>
                <input
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Sujet:</label>
                <input
                  type="text"
                  value={eventForm.subject}
                  onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="Sujet de la réunion"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="Description de la réunion"
                  rows={3}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Statut:</label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="Planifié">Planifié</option>
                  <option value="Annulé">Annulé</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Terminé">Terminé</option>
                </select>
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

