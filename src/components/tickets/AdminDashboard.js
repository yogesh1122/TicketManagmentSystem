import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css'
const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [editAgentId, setEditAgentId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [displayUsername, setdisplayUsername] = useState([]);
  const BaseURL = 'http://localhost:3306'
  // Fetch all agents from the backend
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const displayUsername = await axios.get(`${BaseURL}/users/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('displayUsername=',displayUsername.data.username);
      
      const response = await axios.get(`${BaseURL}/admin/allagentUser`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const agentsData = response.data.agents;
      console.log('agentsData',agentsData)
    if (!Array.isArray(agentsData)) {
      throw new Error('Expected an array of agents, but got:', agentsData);
    }
      setAgents(agentsData);
    } catch (error) {
      toast.error('Error fetching agents');
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit to create or update agent
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editAgentId) {
        // Update agent
        await axios.put(`/agents/${editAgentId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Agent updated successfully');
      } else {
        // Create agent
        await axios.post('/agents', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Agent created successfully');
      }
      fetchAgents(); // Refresh agents list
      setFormData({ username: '', email: '', password: '' });
      setEditAgentId(null);
    } catch (error) {
      toast.error('Error creating/updating agent');
    }
  };

  // Handle delete agent
  const handleDeleteAgent = async (id) => {
    try {
      await axios.delete(`/agents/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Agent deleted successfully');
      fetchAgents(); // Refresh agents list
    } catch (error) {
      toast.error('Error deleting agent');
    }
  };

  // Handle edit agent
  const handleEditAgent = (agent) => {
    setFormData({ username: agent.username, email: agent.email, password: '' });
    setEditAgentId(agent.id);
  };

  // Handle change role
  const handleChangeRole = async (id,role) => {
    try {
      console.log('change role',id)
      console.log('Axios instance:', axios);
      let URL =`${BaseURL}/admin/rolechanges/${id}`;
      console.log('----------------->',role);
      
      const response = await axios.put(`${URL}`,{
        userrole: role === 'agent' ? 'user' : 'agent'
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).catch((e)=>{console.log(e);
      });
      console.error(response.data)
      if(response){
      toast.success('Role changed successfully');
      }
      fetchAgents(); // Refresh agents list
    } catch (error) {
      toast.error('Error changing role');
    }
  };

  // Handle select agent
  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="admin-dashboard-container">
      <ToastContainer />
      <span className='adminhead'>Admin Dashboard</span>
      <a href="mailto:your-email@example.com" class="btn--primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"></path></svg>
        Get in touch
        <span>Get in touch with user and agent</span>
      </a>
      {/* Agent List */}
      <h3>list Agents</h3>
      <button className="lbutton" onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/';
      }}>Logout</button>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.username}</td>
              <td>{agent.email}</td>
              <td>{agent.role}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditAgent(agent)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteAgent(agent.id)}>Delete</button>
                {/* <button onClick={() => handleSelectAgent(agent)}>Select</button> */}
                <button className="change-role-btn" onClick={() => handleChangeRole(agent.id, agent.role)}>ChangeRole</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Agent Form */}
      <h2>{editAgentId ? 'Edit Agent' : 'Create Agent'}</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required={!editAgentId} // Make password required only for new agents
        />
        <button type="submit">{editAgentId ? 'Update Agent' : 'Create Agent'}</button>
      </form>
    </div>
  );
};

export default AdminDashboard;