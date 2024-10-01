const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const { validateSignup, validateLogin } = require('../middlewares/validation/userValidation');
// user signup
router.post('/signup',validateSignup, userController.signup);

// user login
router.post('/login',validateLogin, userController.login);

// get user profile
router.get('/profile', authMiddleware, userController.getProfile);



module.exports = router;
