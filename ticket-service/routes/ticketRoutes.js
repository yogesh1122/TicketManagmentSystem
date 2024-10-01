const express = require('express');
const router = express.Router();
const { listTickets, createTicket, updateTicket, deleteTicket, getUserTickets, getagentsTickets, unassignedlistTickets } = require('../controller/ticketController');
const { validateTicket, validateUpdateTicket } = require('../middlewares/validators');
const auth = require('../middlewares/auth');

router.get('/tickets', listTickets);
router.get('/tickets/unassigned', unassignedlistTickets);
// router.get('/tickets/:id', validateUpdateTicket, updateTicket);
router.post('/tickets/user/create', validateTicket,auth,createTicket);
router.delete('/tickets/:id', deleteTicket);
router.get('/tickets/user',auth,getUserTickets);
router.put('/tickets/agent/:ticketId', validateUpdateTicket, updateTicket);
router.get('/tickets/agent',auth,getagentsTickets);
// router.get('/tickets/agent',auth,getagentsTickets);
router.get('/tickets/alltickets',auth,listTickets);


module.exports = router;
