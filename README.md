# Smart Support Ticket Inbox System - Backend

A complete backend system for a smart support ticket management application built with the MERN stack. Features robust authentication, ticket management, real-time notes, and comprehensive analytics.

## 🚀 Features

- **🔐 JWT Authentication** - Secure user registration and login
- **🎫 Ticket Management** - Full CRUD operations with soft delete
- **📝 Real-time Notes** - Collaborative ticket notes with HTML sanitization
- **📊 Dashboard Analytics** - Comprehensive statistics with MongoDB aggregations
- **🔍 Advanced Filtering** - Search, filter, and pagination
- **✅ Input Validation** - Zod schema validation
- **🛡️ Security** - Password hashing, XSS protection, error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/javalepratik7/smart-support-backend
cd smart-support-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/support_tickets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

### 4. Start the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

### 5. Verify Installation

```bash
curl http://localhost:3000/health
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── ticketController.js  # Ticket CRUD operations
│   │   ├── noteController.js    # Notes management
│   │   └── statsController.js   # Analytics and statistics
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validation.js        # Request validation
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Ticket.js            # Ticket schema
│   │   └── Note.js              # Note schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── tickets.js           # Ticket routes
│   │   ├── notes.js             # Note routes
│   │   └── stats.js             # Statistics routes
│   ├── utils/
│   │   ├── hashPassword.js      # Password utilities
│   │   └── constants.js         # Application constants
│   └── server.js                # Main server file
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | User login | No |

### Ticket Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/tickets` | Get all tickets (with filters) | No |
| `GET` | `/tickets/:id` | Get specific ticket | No |
| `POST` | `/tickets` | Create new ticket | No |
| `PATCH` | `/tickets/:id` | Update ticket status/priority | No |
| `DELETE` | `/tickets/:id` | Soft delete ticket | No |

### Note Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/tickets/:id/notes` | Get all notes for ticket | No |
| `POST` | `/tickets/:id/notes` | Add note to ticket | **Yes** |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/stats` | Get dashboard statistics | No |

## 🎯 Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a Ticket

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login Issue",
    "description": "Unable to access dashboard",
    "customer_email": "customer@example.com",
    "priority": "high"
  }'
```

### Add a Note to Ticket

```bash
curl -X POST http://localhost:3000/tickets/507f1f77bcf86cd799439011/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "text": "Issue has been escalated to technical team."
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/support_tickets` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | `3000` |

### Database Models

**User Model:**
```javascript
{
  name: String,
  email: String (unique),
  password_hash: String,
  created_at: Date,
  updated_at: Date
}
```

**Ticket Model:**
```javascript
{
  title: String,
  description: String,
  customer_email: String,
  status: ['open', 'pending', 'resolved'],
  priority: ['low', 'medium', 'high'],
  deleted: Boolean,
  created_at: Date,
  updated_at: Date
}
```

**Note Model:**
```javascript
{
  ticket_id: ObjectId,
  user_id: ObjectId,
  text: String,
  created_at: Date,
  updated_at: Date
}
```

## 🛡️ Security Features

- **Password Hashing**: SHA-256 hashing for user passwords
- **JWT Authentication**: Stateless token-based authentication
- **Input Validation**: Zod schema validation for all requests
- **HTML Sanitization**: XSS protection for user-generated content
- **Error Handling**: Consistent error responses without sensitive data
- **Soft Delete**: Data retention with soft deletion

## 📊 Analytics & Aggregations

The stats endpoint provides:

- Total ticket counts
- Status distribution (open, pending, resolved)
- Priority breakdown (low, medium, high)
- Last 7 days ticket creation trends
- MongoDB aggregation pipeline for efficient data processing

## 🚀 Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for large datasets
- MongoDB aggregation for complex analytics
- Efficient query filtering and sorting

## 🔄 Development

### Scripts

```bash
npm run dev      # Start development server with nodemon
```

### Adding New Features

1. Create model in `src/models/`
2. Add validation schema in `src/middleware/validation.js`
3. Implement controller in `src/controllers/`
4. Create routes in `src/routes/`
5. Update server.js with new routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or update `MONGODB_URI`
   - Check connection string format

2. **JWT Errors**
   - Verify `JWT_SECRET` is set in environment variables
   - Check token format in Authorization header

3. **Validation Errors**
   - Review request body against API documentation
   - Check required fields and data types

### Getting Help

- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review the API documentation above

## 🙏 Acknowledgments

- Built with Express.js and MongoDB
- JWT for secure authentication
- Zod for robust validation
- sanitize-html for XSS protection

---