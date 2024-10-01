import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AgentDashboard.css'
const AgentDashboard = () => {
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [displayUsername, setdisplayUsername] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState({});
  const [selectedAgents, setSelectedAgents] = useState({});
  const [agentMap, setAgentMap] = useState(new Map());
  const [activeTab, setActiveTab] = useState('assigned');
   const BaseURL = 'http://localhost:3306'
  useEffect(() => {
    // Fetch tickets and agents
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const displayUsername = await axios.get(`${BaseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setdisplayUsername(displayUsername.data.username)
        // Fetch tickets assigned to the agent
        const assignedTicketResponse = await axios.get('http://localhost:3001/tickets/agent', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(assignedTicketResponse.data.rows)) {
          setAssignedTickets(assignedTicketResponse.data.rows);
        } else {
          console.error('API response is not an array:', assignedTicketResponse.data);
          setAssignedTickets([]);
        }

        // Fetch unassigned tickets
        const unassignedTicketResponse = await axios.get('http://localhost:3001/tickets/unassigned', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(unassignedTicketResponse.data.data)) {
          setUnassignedTickets(unassignedTicketResponse.data.data);
        } else {
          console.error('API response is not an array:', unassignedTicketResponse.data);
        }

        // Fetch all agents for the dropdown
        const agentResponse = await axios.get('http://localhost:3306/agents/getallagents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(agentResponse.data)) {
          setAgents(agentResponse.data);
          const agentMap = new Map(agentResponse.data.map(agent => [agent.id, agent]));
          setAgentMap(agentMap);
        } else {
          console.error('API response is not an array:', agentResponse.data);
          setAgents([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error.response || error.message);
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to assign a ticket to the agent (self)
  const assignTicketToSelf = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3306/agents/assign/${ticketId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Ticket assigned to you successfully.');
      setAssignedTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, assigned: true } : ticket
        )
      );
      setUnassignedTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
    } catch (error) {
      console.error('Error assigning ticket to self:', error.response || error.message);
      toast.error('Failed to assign the ticket to you.');
    }
  };

  // Function to assign a ticket to another agent
  const assignTicketToAgent = async (ticketId) => {
    if (!selectedAgents[ticketId]) { // <--- Changed Line 1
      toast.error('Please select an agent.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3306/agents/assign/${ticketId}`,
        { agentId: selectedAgents[ticketId] }, // <--- Changed Line 2
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Ticket assigned to the selected agent successfully.');
      setAssignedTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, agentId: selectedAgents[ticketId], assigned: true } : ticket // <--- Changed Line 3
        )
      );
      setUnassignedTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
    } catch (error) {
      console.error('Error assigning ticket to another agent:', error.response || error.message);
      toast.error('Failed to assign the ticket to the selected agent.');
    }
  };

  // Function to update ticket status or details
  const updateTicketStatus = async (ticketId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/tickets/agent/${ticketId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Ticket has been closed successfully.');
      setAssignedTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );
    } catch (error) {
      console.error('Error updating ticket status:', error.response || error.message);
      toast.error('Failed to update the ticket status.');
    }
  };

  return (
    <div>
      <header className="agent-dashboard-header">
      <h1>Agent Dashboard</h1>
        <nav className="agent-navbar">
          <div className="agent-navbar-left">
            <span className="agent-name">{`${displayUsername}`}</span>
          </div>
          <div className="agent-navbar-right">
            <button className="lbutton" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userRole');
              window.location.href = '/';
            }}>Logout</button>
          </div>
        </nav>
    </header>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <div className="ticket-list-container-wrapper">
          <h2>All Assigned Tickets</h2>
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned to</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>{ displayUsername? displayUsername :'Unassigned'}</td>
                  <td>
                    {ticket.agentId ? (
                      <button onClick={() => updateTicketStatus(ticket.id, 'closed')}>Mark as Resolved</button>
                    ) : (
                      <div>
                        <button onClick={() => assignTicketToSelf(ticket.id)}>Assign to Me</button>
                        <select onChange={(e) => setSelectedAgent(e.target.value)} value={selectedAgent}>
                          <option value="">Select Agent</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>{agent.username}</option>
                          ))}
                        </select>
                        <button onClick={() => assignTicketToAgent(ticket.id)}>Assign to Selected Agent</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <h2>Unassigned Tickets</h2>
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unassignedTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>
                    <div>
                      <button onClick={() => assignTicketToSelf(ticket.id)}>Assign to Me</button>
                      <select onChange={(e) => setSelectedAgents((prevSelectedAgents) => ({ ...prevSelectedAgents, [ticket.id]: e.target.value }))} value={selectedAgents[ticket.id]}>
                        <option value="">Select Agent</option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>{agent.username}</option>
                        ))}
                      </select>
                      <button onClick={() => assignTicketToAgent(ticket.id,selectedAgents[ticket.id])}>Assign to Selected Agent</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

};

export default AgentDashboard;
