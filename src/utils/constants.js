module.exports = {
  TICKET_STATUS: {
    OPEN: 'open',
    PENDING: 'pending',
    RESOLVED: 'resolved'
  },
  TICKET_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  }
};