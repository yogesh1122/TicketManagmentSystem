const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const authMiddleware = require('../middlewares/auth');
const { validateSignup, validateLogin } = require('../middlewares/validation/userValidation');
const authMiddleware = require('../middlewares/authAdminMiddleware'); // Middleware for authentication

// user signup --> authMiddleware.verifyAdmin
router.put('/rolechanges/:id', adminController.roleChange);

// user login
router.delete('/removeagent/:id', adminController.deleteAgentUser);

// get user/agent profile
router.get('/allagentUser', adminController.getAllUserAgents);


module.exports = router;
