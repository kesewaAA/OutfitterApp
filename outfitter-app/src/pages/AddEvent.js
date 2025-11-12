import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddEvent.css';
import Navigation from '../components/Navigation';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const navigate = useNavigate();
  const { eventId } = useParams();

  useEffect(() => {
    if (eventId) {
      fetch(`/api/event/${eventId}`)
        .then(res => res.json())
        .then(data => {
          setEventName(data.name);
          setEventDate(data.date);
          setEventDescription(data.description);
        });
    }
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      name: eventName,
      date: eventDate,
      description: eventDescription,
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

  return (
    <div className="add-event-container">
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
        <button type="submit" className="done-button">Done</button>
      </form>
      <Navigation />
    </div>
  );
}

export default AddEvent;
