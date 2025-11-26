const express = require('express');
const {
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  createTicket
} = require('../controllers/ticketController');
const { validate, ticketCreateSchema, ticketUpdateSchema } = require('../middleware/validation');

const router = express.Router();

router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.post('/', validate(ticketCreateSchema), createTicket);
router.patch('/:id', validate(ticketUpdateSchema), updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;