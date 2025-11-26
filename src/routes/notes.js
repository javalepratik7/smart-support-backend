const express = require('express');
const { getNotesByTicket, createNote } = require('../controllers/noteController');
const { authenticate } = require('../middleware/auth');
const { validate, noteSchema } = require('../middleware/validation');

const router = express.Router();

router.get('/:id/notes', getNotesByTicket);
router.post('/:id/notes', authenticate, validate(noteSchema), createNote);

module.exports = router;