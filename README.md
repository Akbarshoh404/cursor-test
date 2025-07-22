# PrepX - IELTS Preparation Platform

A comprehensive IELTS preparation platform with a React frontend and Node.js backend, providing mock tests, writing practice, and learning resources.

## 🚀 Features

### Frontend (React)
- **User Authentication**: Login and registration system
- **Dashboard**: Progress tracking and statistics
- **Mock Tests**: Full IELTS practice tests (Listening, Reading, Writing)
- **Writing Practice**: Task 1 & Task 2 practice with feedback
- **Learning Resources**: Tips, vocabulary, and study materials
- **Responsive Design**: Works on desktop and mobile devices

### Backend (Node.js/Express)
- **RESTful API**: Comprehensive API for all frontend features
- **Authentication**: JWT-based secure authentication
- **Database**: SQLite database with proper schema
- **Test Management**: Mock test creation and scoring
- **Writing Assessment**: Automated feedback and band estimation
- **Security**: Rate limiting, input validation, and security headers

## 🛠 Technology Stack

### Frontend
- React 19.1.0
- React Router DOM 7.7.0
- CSS3 with modern design

### Backend
- Node.js with Express.js
- SQLite3 database
- JWT authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Helmet.js for security

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd prepx-platform
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Seed the database with demo data
npm run seed

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd prepx-mvp

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the backend directory:

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

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables
Create a `.env` file in the prepx-mvp directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Demo Account

The system comes with a pre-configured demo account:

- **Email**: john.doe@example.com
- **Password**: password123

This account includes sample test results and writing submissions for demonstration purposes.

## 📚 API Documentation

The backend provides a comprehensive REST API. Key endpoints include:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Tests
- `GET /api/tests` - Get available tests
- `GET /api/tests/:id` - Get test details
- `POST /api/tests/:id/start` - Start a test attempt
- `POST /api/tests/:id/submit` - Submit test answers

### Writing
- `POST /api/writing/submit` - Submit writing practice
- `GET /api/writing/history` - Get writing history
- `GET /api/writing/prompts` - Get writing prompts
- `GET /api/writing/samples` - Get sample answers

### Resources
- `GET /api/resources/tips` - Get study tips
- `GET /api/resources/vocabulary` - Get vocabulary lists
- `GET /api/resources/study-plans` - Get study plans

For complete API documentation, see `backend/README.md`.

## 🏗 Project Structure

```
prepx-platform/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   ├── database/           # SQLite database
│   ├── uploads/            # File uploads
│   └── package.json
├── prepx-mvp/              # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── data/           # Mock data (legacy)
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Install production dependencies: `npm ci --only=production`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the production version: `npm run build`
2. Serve the build folder using a web server (nginx, Apache, etc.)

### Docker Deployment
Docker configurations can be added for containerized deployment.

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive validation using express-validator
- **SQL Injection Protection**: Parameterized queries
- **CORS Protection**: Configured for specific frontend domain
- **Security Headers**: Helmet.js for additional security

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:5000/health
```

### API Testing
Use the provided demo account to test all features:
1. Login with demo credentials
2. Take a mock test
3. Submit writing practice
4. Browse learning resources

## 📈 Features Overview

### 1. User Dashboard
- Weekly test progress tracking
- Writing statistics
- Recent activity summary
- Quick access to all features

### 2. Mock Tests
- Full IELTS format tests
- Automatic scoring for Listening and Reading
- Writing submission with feedback
- Test history and results

### 3. Writing Practice
- Task 1 and Task 2 prompts
- Word count tracking
- Automated feedback
- Band score estimation
- Writing history

### 4. Learning Resources
- Study tips by skill
- Vocabulary lists
- Common mistakes
- Band descriptors
- Study plans (4, 8, 12 weeks)

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
- Check the API health endpoint: `http://localhost:5000/health`
- Review the backend logs for any errors
- Ensure both frontend and backend are running on correct ports

## 🔄 Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd prepx-mvp && npm start`
3. **Access Application**: Navigate to `http://localhost:3000`
4. **Login**: Use demo credentials or create a new account
5. **Test Features**: Try mock tests, writing practice, and resources

## 📋 TODO / Future Enhancements

- [ ] Speaking practice module
- [ ] Advanced writing assessment with AI
- [ ] Mobile app development
- [ ] Advanced analytics and progress tracking
- [ ] Social features (study groups, forums)
- [ ] Payment integration for premium features
- [ ] Multi-language support
- [ ] Offline mode capability

---

**PrepX** - Your comprehensive IELTS preparation companion! 🎓