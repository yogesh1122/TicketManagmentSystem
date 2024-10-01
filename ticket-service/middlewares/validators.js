const Joi = require('joi');

// Schema for ticket creation
const ticketSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title should be at least 3 characters long'
  }),
  description: Joi.string().optional().allow(''),
  userId: Joi.string().min(8).optional().allow(''),
  status: Joi.string().valid('open', 'in-progress', 'closed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional()
});

// Schema for ticket update
const ticketUpdateSchema = Joi.object({
  agentId: Joi.string().optional(), 
  title: Joi.string().min(3).optional(),
  description: Joi.string().optional().allow(''),
  status: Joi.string().valid('open', 'in-progress', 'closed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional()
});

// Middleware function to validate ticket creation
const validateTicket = (req, res, next) => {
  const { error } = ticketSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(e => e.message) });
  }
  next();
};

// Middleware function to validate ticket update
const validateUpdateTicket = (req, res, next) => {
  const { error } = ticketUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(e => e.message) });
  }
  next();
};

module.exports = {
  validateTicket,
  validateUpdateTicket
};
