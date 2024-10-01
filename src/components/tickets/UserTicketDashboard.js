import React, { useEffect, useState } from 'react';
import { ReactComponent as PlusIcon } from './plus.svg';
import axios from 'axios';
import './UserTicketDashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('token#####',token)
        const response = await axios.get('http://localhost:3001/tickets/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsername(response.data.username);
        setTickets(response.data.tickets);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tickets');
      }
    };

    fetchTickets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/tickets/user/create', newTicket, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Ticket created successfully!');
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
      });
      setShowForm(false);

      // Refresh the ticket list
      const response = await axios.get('http://localhost:3001/tickets/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTickets(response.data.tickets);
      console.log(response.data.ticket);
      
    } catch (err) {
      console.log('##',err.response.data.errors[0]);
      alert(err.response.data.errors[0])  
      toast.error(err.response.data.errors[0])  
    //   toast.error(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>{username ? `${username}'s Tickets` : 'User Tickets'}</h2>
        <button className="create-ticket-btn" onClick={() => setShowForm(true)}>
        <PlusIcon/>
        </button>
        <button className="lbutton" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userRole');
              window.location.href = '/';
            }}>Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="ticket-container">
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div className={`ticket-card color-${index % 3}`} key={ticket.id}>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <span className="ticket-status">Status: {ticket.status}</span>
              <span className="ticket-priority">Priority: {ticket.priority}</span>
              <p className="ticket-date">Created at: {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No tickets found</p>
        )}
      </div>
      {showForm && (
        <div className="ticket-form">
          <form onSubmit={handleSubmit}>
            <h3>Create New Ticket</h3>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={newTicket.title}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newTicket.description}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Priority:
              <select
                name="priority"
                value={newTicket.priority}
                onChange={handleInputChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
