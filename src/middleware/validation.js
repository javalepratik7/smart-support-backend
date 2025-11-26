const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const ticketCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  customer_email: z.string().email('Invalid customer email format'),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

const ticketUpdateSchema = z.object({
  status: z.enum(['open', 'pending', 'resolved']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

const noteSchema = z.object({
  text: z.string().min(1, 'Note text is required').max(1000)
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details
    });
  }
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  ticketCreateSchema,
  ticketUpdateSchema,
  noteSchema
};