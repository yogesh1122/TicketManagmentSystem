const User = require('../models/userModel');
const Ticket = require('.././../ticket-service/models/ticket');
const axios = require('axios');
// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.findAll({ where: { role: 'agent' } });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving agents', error });
  }
};

// Create a new agent
exports.createAgent = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newAgent = await User.create({
      username,
      email,
      password, // Make sure to hash the password before storing it
      role: 'agent',
    });
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating agent', error });
  }
};

// Update an agent
exports.updateAgent = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const agent = await User.findByPk(id);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Update agent details
    agent.username = username || agent.username;
    agent.email = email || agent.email;
    if (password) {
      agent.password = password; // Make sure to hash the password before storing it
    }

    await agent.save();
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating agent', error });
  }
};






// Get all tickets that are either unassigned or assigned to the agent
// const getAgentTickets = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.userId);

//     const tickets = await Ticket.findAll({
//       where: {
//         [Op.or]: [
//           { agentId: null }, // Unassigned tickets
//           { agentId: user.id } // Tickets assigned to the agent
//         ]
//       }
//     });

//     res.json(tickets);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch tickets.' });
//   }
// };

// Assign a ticket to the agent
exports.assignTicket = async (req, res) => {
  
  console.log(`req.user.userId`,req.user.userId);
  const { ticketId } = req.params;
  const { agentId } = req.body;
  console.log(`ticketID & agentId`,ticketId,agentId);
  const token = req.headers.authorization;
  
  try {
    const user = await User.findByPk(agentId);

    console.log('Inside of assign agents ROUTES --user backed',user.role);
    
    // Only proceed if the user is an agent
    if (user.role !== 'agent') {
      return res.status(403).json({ message: 'Only agents can assign tickets.' });
    }
    
     // Fetch the ticket from the ticket service with authorization
     console.log(`Fetching ticket from the ticket service`);
     const ticketServiceUrl = `http://localhost:3001/tickets/agent`;
     console.log(ticketServiceUrl);
     
    const ticketgetResponse = await axios.get(ticketServiceUrl, {headers: { Authorization: ` ${token}`,'Content-Type': 'application/json'},},);
    console.log('ticketgetResponse-------',ticketgetResponse.data);
        
    if (ticketgetResponse.status !== 200) {
      return res.status(ticketgetResponse.status).json({ message: ticketgetResponse.data.message });
    }

    const ticket = ticketgetResponse.data;

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Assign the ticket to the agent
    ticket.agentId = user.id;
    console.log(`Assigning ticket to agent:`, ticket);

     const updateResponse = await axios.put(`${ticketServiceUrl}/${ticketId}`,{ agentId: ticket.agentId }, {
       headers: { Authorization: `${token}` }
     });
    
   
    if (updateResponse.status === 200) {
      res.json({ message: 'Ticket assigned successfully.' });
    } else {
      res.status(updateResponse.status).json({ message: updateResponse.data.message });
    } 

  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No Response Received:', error.request);
    } else {
      console.error('Error in Setup:', error.message);
    }
    res.status(500).json({ message: 'Failed to assign ticket.' });
  }
};

// Update ticket status or details
exports.updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;
  try {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Only allow the agent assigned to this ticket or an admin to update the ticket
    const user = await User.findByPk(req.userId);
    if (user.id !== ticket.agentId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the assigned agent or an admin can update this ticket.' });
    }

    // Update the ticket
    ticket.status = status;
    await ticket.save();

    res.json({ message: 'Ticket updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update ticket.' });
  }
};


