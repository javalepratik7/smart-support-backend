const Ticket = require('../models/Ticket');
const { TICKET_STATUS, TICKET_PRIORITY, PAGINATION } = require('../utils/constants');

const getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const { status, priority, search } = req.query;

    let filter = { deleted: false };

    if (status && Object.values(TICKET_STATUS).includes(status)) {
      filter.status = status;
    }

    if (priority && Object.values(TICKET_PRIORITY).includes(priority)) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { customer_email: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .select('-deleted');

    const total = await Ticket.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tickets',
      details: error.message
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      deleted: false
    }).select('-deleted');

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch ticket',
      details: error.message
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { status, priority } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      {
        ...(status && { status }),
        ...(priority && { priority }),
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    ).select('-deleted');

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    // ✅ Ensure this response format
    res.json({
      message: 'Ticket updated successfully',
      ticket  // This is what the frontend expects as data.ticket
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update ticket',
      details: error.message
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true, updated_at: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    res.json({
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete ticket',
      details: error.message
    });
  }
};

const createTicket = async (req, res) => {
  try {
    const { title, description, customer_email, priority } = req.body;

    const ticket = new Ticket({
      title,
      description,
      customer_email,
      priority: priority || 'medium'
    });

    await ticket.save();

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create ticket',
      details: error.message
    });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  createTicket
};