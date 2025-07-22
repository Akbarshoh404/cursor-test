# PrepX Backend API

A comprehensive backend API for the PrepX IELTS preparation platform, built with Node.js, Express, and SQLite.

## 🚀 Features

- **Authentication System**: JWT-based authentication with secure password hashing
- **Mock Tests**: Full IELTS practice tests with automatic scoring
- **Writing Practice**: Essay submission with automated feedback and band estimation
- **Learning Resources**: Tips, vocabulary, study plans, and sample answers
- **User Management**: Profile management and progress tracking
- **Rate Limiting**: API protection against abuse
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Helmet.js security headers and CORS protection

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Express Validator
- **Security**: Helmet.js, bcryptjs
- **Environment**: dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Or start the production server**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_PATH=./database/prepx.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Test Endpoints

#### Get Available Tests
```http
GET /api/tests
Authorization: Bearer <token>
```

#### Get Test Details
```http
GET /api/tests/:testId
Authorization: Bearer <token>
```

#### Start Test Attempt
```http
POST /api/tests/:testId/start
Authorization: Bearer <token>
```

#### Submit Test Answers
```http
POST /api/tests/:testId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "attemptId": 1,
  "answers": {
    "listening": [0, 1, 2, 0],
    "reading": ["storage", "False", "decreased"],
    "writing": {
      "task1": "The chart shows...",
      "task2": "In my opinion..."
    }
  }
}
```

#### Get Test Results
```http
GET /api/tests/results/:attemptId
Authorization: Bearer <token>
```

#### Get Test History
```http
GET /api/tests/history/all?page=1&limit=10
Authorization: Bearer <token>
```

### Writing Endpoints

#### Submit Writing Practice
```http
POST /api/writing/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskType": "task1",
  "prompt": "The chart shows...",
  "answer": "The chart illustrates..."
}
```

#### Get Writing History
```http
GET /api/writing/history?page=1&limit=10&taskType=task1
Authorization: Bearer <token>
```

#### Get Writing Submission
```http
GET /api/writing/submission/:submissionId
Authorization: Bearer <token>
```

#### Get Writing Prompts
```http
GET /api/writing/prompts?taskType=task1
Authorization: Bearer <token>
```

#### Get Sample Answers
```http
GET /api/writing/samples?taskType=task1&band=band7
Authorization: Bearer <token>
```

#### Get Writing Statistics
```http
GET /api/writing/stats
Authorization: Bearer <token>
```

### Resources Endpoints

#### Get All Resources
```http
GET /api/resources?category=listening&type=tips
```

#### Get Tips
```http
GET /api/resources/tips?category=listening
```

#### Get Common Mistakes
```http
GET /api/resources/mistakes?category=writing
```

#### Get Vocabulary
```http
GET /api/resources/vocabulary?category=academic
```

#### Get Band Descriptors
```http
GET /api/resources/bands?skill=writing
```

#### Get Study Plans
```http
GET /api/resources/study-plans?duration=8_weeks
```

## 🗄 Database Schema

The application uses SQLite with the following main tables:

- **users**: User accounts and profiles
- **tests**: Available mock tests
- **user_test_attempts**: Test attempts and results
- **writing_submissions**: Writing practice submissions
- **questions**: Test questions for each section
- **learning_resources**: Tips, guides, and study materials
- **user_sessions**: JWT session management

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive validation using express-validator
- **SQL Injection Protection**: Parameterized queries
- **CORS Protection**: Configured for specific frontend domain
- **Security Headers**: Helmet.js for additional security

## 📊 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## 🧪 Testing

### Health Check
```http
GET /health
```

Response:
```json
{
  "success": true,
  "message": "PrepX Backend API is running",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 1234.567
}
```

## 🚀 Deployment

### Production Setup

1. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your-production-secret
   export FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Install production dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (not implemented yet)

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── testController.js
│   │   ├── writingController.js
│   │   └── resourcesController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tests.js
│   │   ├── writing.js
│   │   └── resources.js
│   ├── utils/
│   │   └── helpers.js
│   └── server.js
├── uploads/
├── database/
├── .env
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation above
- Review the health check endpoint for server status

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - User authentication
  - Mock tests with scoring
  - Writing practice with feedback
  - Learning resources
  - Comprehensive API documentation