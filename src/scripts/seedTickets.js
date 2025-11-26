const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/support_tickets';

// Sample data
const statuses = ['open', 'pending', 'resolved'];
const priorities = ['low', 'medium', 'high'];

const sampleTitles = [
  'Login issues',
  'Payment not processing',
  'Dashboard not loading',
  'Email notifications not working',
  'Profile picture not uploading',
  'Password reset not working',
  'App crashing on startup',
  'Slow performance',
  'Feature request: Dark mode',
  'Billing inquiry',
  'Account locked',
  'Two-factor authentication setup',
  'API integration help',
  'Mobile app issues',
  'Data export not working',
  'Import functionality broken',
  'UI layout problems',
  'Search not returning results',
  'Filter not working properly',
  'Notification settings reset'
];

const sampleDescriptions = [
  'User is unable to login with correct credentials',
  'Payment gets stuck at processing stage',
  'Dashboard shows blank screen after latest update',
  'No email notifications received for important alerts',
  'Profile picture upload fails with error message',
  'Password reset link not arriving in email',
  'Application crashes immediately after launching',
  'Extremely slow response times across all features',
  'Requesting dark mode theme for better night usage',
  'Question about recent charges on credit card',
  'Account shows as locked after multiple failed attempts',
  'Need help setting up two-factor authentication',
  'Having trouble integrating with REST API',
  'Mobile app freezes when switching between tabs',
  'Data export generates empty files',
  'Import function fails with format error',
  'UI elements overlapping on smaller screens',
  'Search returns no results for valid queries',
  'Filters reset when changing pages',
  'Notification preferences keep reverting to default'
];

const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
const firstNames = ['alex', 'sam', 'jordan', 'taylor', 'casey', 'morgan', 'riley', 'quinn', 'avery', 'peyton'];
const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez'];

const generateRandomEmail = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName}.${lastName}@${domain}`;
};

const generateRandomTickets = (count = 50) => {
  const tickets = [];
  
  for (let i = 0; i < count; i++) {
    const titleIndex = Math.floor(Math.random() * sampleTitles.length);
    const descriptionIndex = Math.floor(Math.random() * sampleDescriptions.length);
    
    // Create some variation in titles and descriptions
    const title = sampleTitles[titleIndex];
    const description = sampleDescriptions[descriptionIndex];
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Generate random dates within the last 30 days
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const updatedDate = new Date(createdDate);
    if (status !== 'open') {
      updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 7));
    }
    
    tickets.push({
      title: `${title} #${i + 1}`,
      description: `${description} - Ticket reference: ${i + 1000}`,
      customer_email: generateRandomEmail(),
      status,
      priority,
      created_at: createdDate,
      updated_at: updatedDate,
      deleted: false
    });
  }
  
  return tickets;
};

const seedTickets = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tickets (optional - remove if you want to keep existing data)
    console.log('Clearing existing tickets...');
    await Ticket.deleteMany({});
    console.log('Existing tickets cleared');

    // Generate and insert new tickets
    console.log('Generating 50 random tickets...');
    const tickets = generateRandomTickets(50);
    
    console.log('Inserting tickets into database...');
    const result = await Ticket.insertMany(tickets);
    
    console.log(`✅ Successfully seeded ${result.length} tickets into the database!`);
    
    // Display some statistics
    const statusCounts = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const priorityCounts = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📊 Seed Statistics:');
    console.log('Status Distribution:');
    statusCounts.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} tickets`);
    });
    
    console.log('Priority Distribution:');
    priorityCounts.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} tickets`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding tickets:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedTickets();
}

module.exports = { seedTickets, generateRandomTickets };