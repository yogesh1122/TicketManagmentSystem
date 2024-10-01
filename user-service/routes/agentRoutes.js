const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middlewares/authAdminMiddleware'); // Middleware for authentication
const verifyToken = require('../middlewares/auth');
const { assignTicket } = require('../controllers/agentController');
const auth = require('../middlewares/auth');
// Get all agents
router.get('/getallagents',auth, authMiddleware.isAgentOrAdmin, agentController.getAllAgents);

// Create a new agent
router.post('/', authMiddleware.verifyAdmin, agentController.createAgent);

// Update an agent
router.put('/:id', authMiddleware.verifyAdmin, agentController.updateAgent);

// Delete an agent
// router.delete('/:id', authMiddleware.verifyAdmin, agentController.deleteAgent);

//######## ****  agent can see ticket and assignd to self ****/

// Route to get all unassigned tickets or tickets assigned to the agent
// router.get('/agent', verifyToken, authMiddleware.isAgentOrAdmin, getAgentTickets);

// Route to assign a ticket to the agent
router.post('/assign/:ticketId', verifyToken, authMiddleware.isAgentOrAdmin, assignTicket);

// Route to update ticket status
router.put('/:ticketId', verifyToken, authMiddleware.isAgentOrAdmin, agentController.updateTicket);



module.exports = router;
