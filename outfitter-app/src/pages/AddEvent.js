import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './AddEvent.css';
import Navigation from '../components/Navigation';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedClothing, setSelectedClothing] = useState([]);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();

  useEffect(() => {
    // If we have selected clothing from the closet, prioritize it.
    if (location.state?.selectedClothing) {
      setSelectedClothing(location.state.selectedClothing);
    }
    
    if (location.state?.fromCloset) {
      setEventName(location.state.eventName || '');
      setEventDate(location.state.eventDate || '');
      setEventDescription(location.state.eventDescription || '');
    }

    // If we are editing an event, fetch its data.
    if (eventId && !location.state?.fromCloset) {
      fetch(`/api/event/${eventId}`)
        .then(res => res.json())
        .then(data => {
          setEventName(data.name);
          setEventDate(data.date);
          setEventDescription(data.description);
          // Only set clothing from fetch if we don't have it from the closet state.
          if (!location.state?.selectedClothing) {
            setSelectedClothing(data.clothing || []);
          }
        });
    }
  }, [eventId, location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      name: eventName,
      date: eventDate,
      description: eventDescription,
      clothing: selectedClothing,
    };

    const url = eventId ? `/api/update-event/${eventId}` : '/api/add-event';
    const method = eventId ? 'PUT' : 'POST';

    if (eventId) {
      eventData.id = eventId;
    }

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        navigate('/');
      });
  };

  const handleAddClothes = () => {
    navigate('/closet', {
      state: {
        selectionMode: true,
        selectedClothing: selectedClothing,
        eventId: eventId,
        eventName: eventName,
        eventDate: eventDate,
        eventDescription: eventDescription
      }
    });
  };

  const handleDelete = () => {
    fetch(`/api/delete-event/${eventId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        navigate('/');
      });
  };

  return (
    <div className="add-event-container">
      <div className="scrollable-content">
        <header className="header">
          <h1 className="app-name">{eventId ? 'Edit Event' : 'Add Event'}</h1>
        </header>
        <form onSubmit={handleSubmit} className="add-event-form">
          <div className="form-group">
            <label htmlFor="event-name">Event</label>
            <input
              type="text"
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-date">Date</label>
            <input
              type="text"
              id="event-date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-description">Description (Optional)</label>
            <textarea
              id="event-description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>

          <div className="outfit-section">
            <h2>Outfit</h2>
            {selectedClothing.length > 0 ? (
              <div className="selected-clothing-grid">
                {selectedClothing.map(item => (
                  <div key={item.id} className="selected-clothing-item">
                    <img src={require(`../assets/clothing/${item.src.substring(2)}`)} alt={item.alt} />
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No clothing selected for this event.</p>
            )}
            <button type="button" onClick={handleAddClothes} className="add-clothes-button">
              {selectedClothing.length > 0 ? 'Modify Event Outfit' : 'Add Clothes from Closet'}
            </button>
          </div>

          <button type="submit" className="done-button">Done</button>
          {eventId && (
            <button type="button" onClick={handleDelete} className="delete-button">
              Delete Event
            </button>
          )}
        </form>
      </div>
      <Navigation />
    </div>
  );
}

export default AddEvent;
