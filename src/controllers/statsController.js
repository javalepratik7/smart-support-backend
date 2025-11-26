const Ticket = require('../models/Ticket');
const { TICKET_STATUS, TICKET_PRIORITY } = require('../utils/constants');

const getStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await Ticket.aggregate([
      {
        $match: {
          deleted: false
        }
      },
      {
        $facet: {
          totalTickets: [
            { $count: 'count' }
          ],
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          priorityCounts: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 }
              }
            }
          ],
          last7Days: [
            {
              $match: {
                created_at: { $gte: sevenDaysAgo }
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$created_at'
                  }
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { _id: 1 }
            }
          ]
        }
      }
    ]);

    const result = {
      total: stats[0].totalTickets[0]?.count || 0,
      status: {
        open: 0,
        pending: 0,
        resolved: 0
      },
      priority: {
        low: 0,
        medium: 0,
        high: 0
      },
      last7Days: stats[0].last7Days
    };

    stats[0].statusCounts.forEach(item => {
      result.status[item._id] = item.count;
    });

    stats[0].priorityCounts.forEach(item => {
      result.priority[item._id] = item.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch stats',
      details: error.message
    });
  }
};

module.exports = {
  getStats
};