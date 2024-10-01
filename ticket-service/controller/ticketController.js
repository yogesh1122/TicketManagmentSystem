const { agent } = require('supertest');
const { Ticket } = require('../models/ticket'); // Import the Ticket model
const logger = require('../utils/logger');

// List all tickets with pagination and filtering
const listTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const options = {
      where: {},
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    };

    // Apply status filter if provided
    if (status) {
      options.where.status = status;
    }

    const tickets = await Ticket.findAndCountAll(options);
    logger.info('Listing all tickets');
    res.status(200).json({
      data: tickets.rows,
      totalItems: tickets.count,
      totalPages: Math.ceil(tickets.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error listing tickets: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

const unassignedlistTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const options = {
      where: {
        agentId: null,
      },
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    };

    // Apply status filter if provided
    if (status) {
      options.where.status = status;
    }

    const tickets = await Ticket.findAndCountAll(options);
    logger.info('Listing all tickets');
    res.status(200).json({
      data: tickets.rows,
      totalItems: tickets.count,
      totalPages: Math.ceil(tickets.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error listing tickets: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};


// Create a new ticket
const createTicket = async (req, res) => {
  console.log('im in ********');
  
  try {
    const { userId } = req.user;
    const { title, description, status, priority } = req.body;
    const newTicket = await Ticket.create({ title, description, status, priority, userId });
    logger.info('Creating a new ticket');
    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    logger.error(`Error creating ticket: ${error.message}`);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};



// Update a ticket
const updateTicket = async (req, res) => {
  try {
    const { ticketId:id } = req.params;
    const { agentId,status } = req.body;
    
    console.log('reqbody of ticket controller',req.body);
    
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    console.log('ticket need to update',ticket);
    (status) ? status :"in-progress"; 
    // Update the ticket with new details
    await ticket.update({ agentId,title:ticket.title, description:ticket.description, status:status, priority:ticket.priority });
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};

// Delete a ticket (soft delete)
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Perform a soft delete by setting a "deleted" flag or using Sequelize's `destroy` method

    await ticket.destroy(); // or ticket.update({ deleted: true });
    res.status(200).send({response:`Ticket has been deleted successful`}); // No content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
};

const getUserTickets = async (req, res) => {
  const { userId, username } = req.user;
  // const { ticketId } = req.params
  console.log('req.user[inside of ticketcontroller]',req.user);
  
  try {

    const tickets = await Ticket.findAll({ where: { userId } });
    if (!tickets.length) {
      return res.status(404).json({ message: 'No tickets found for this user' });
    }
    
    res.json({
      username:username,
      tickets: tickets
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getagentsTickets = async (req, res) => {
  console.log('getagentsTickets***')
  const { userId, username } = req.user;
  console.log('req.user',req.user);
  const { ticketId } = req.params
  console.log('inside of ticket controller',userId);  
  console.log('req.user[inside of ticketcontroller]',req.user);
  
  try {
    //Fetch all tickets where the userId matches
      console.log(`logging in getUserTicket`,ticketId);
      
    if(userId){
      const ticket = await Ticket.findAndCountAll({ where: { agentId:userId } });
      console.log('inside of assign Ticket service',ticket);
      
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.status(200).json(ticket);
    }
    
  } catch (error) {
    console.error('Error fetching user tickets:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getagentTickets = async (req, res) => {
  const { userId, username } = req.user;
  // const { ticketId } = req.params
  console.log('req.user[inside of ticketcontroller]',req.user);
  
  try {

    const tickets = await Ticket.findAll({ where: { userId } });
    if (!tickets.length) {
      return res.status(404).json({ message: 'No tickets found for this user' });
    }
    
    res.json({
      username:username,
      tickets: tickets
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Export the controller functions
module.exports = {
  listTickets,
  unassignedlistTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getUserTickets,
  getagentsTickets,
  getagentTickets

};
