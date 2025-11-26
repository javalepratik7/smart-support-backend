const Note = require('../models/Note');
const Ticket = require('../models/Ticket');
const sanitizeHtml = require('sanitize-html');

const getNotesByTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      deleted: false
    });

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    const notes = await Note.find({ ticket_id: req.params.id })
      .populate('user_id', 'name email')
      .sort({ created_at: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch notes',
      details: error.message
    });
  }
};

const createNote = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      deleted: false
    });

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    const sanitizedText = sanitizeHtml(req.body.text, {
      allowedTags: [],
      allowedAttributes: {}
    });

    const note = new Note({
      ticket_id: req.params.id,
      user_id: req.user._id,
      text: sanitizedText
    });

    await note.save();

    await note.populate('user_id', 'name email');

    res.status(201).json({
      message: 'Note added successfully',
      note
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create note',
      details: error.message
    });
  }
};

module.exports = {
  getNotesByTicket,
  createNote
};