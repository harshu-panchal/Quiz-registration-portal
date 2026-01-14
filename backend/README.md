# Quiz Portal Backend API

Backend API for the Quiz Registration Portal built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Student Management** - Full CRUD operations with filtering, pagination, and CSV export
- **Quiz Management** - Create, distribute, and track quizzes
- **Analytics Dashboard** - Comprehensive statistics and reporting
- **Security** - Helmet, CORS, rate limiting, and password hashing
- **Error Handling** - Centralized error handling with detailed responses

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**

Edit the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-portal
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:5173
```

3. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongodb
```

4. **Run the server**

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Student.js         # Student model
│   │   ├── Quiz.js            # Quiz model
│   │   └── QuizResponse.js    # Quiz response model
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── studentController.js   # Student CRUD
│   │   ├── quizController.js      # Quiz CRUD
│   │   └── analyticsController.js # Analytics
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── studentRoutes.js   # Student endpoints
│   │   ├── quizRoutes.js      # Quiz endpoints
│   │   └── analyticsRoutes.js # Analytics endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── errorMiddleware.js # Error handling
│   ├── utils/
│   │   └── jwt.js             # JWT utilities
│   └── server.js              # Express app setup
├── .env                       # Environment variables
├── .gitignore
└── package.json
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Student/user login
- `POST /admin/login` - Admin login
- `GET /me` - Get current user (Protected)
- `POST /logout` - Logout (Protected)

### Students (`/api/students`) - Admin Only
- `GET /` - Get all students (with filters & pagination)
- `GET /:id` - Get student by ID
- `POST /` - Create new student
- `PUT /:id` - Update student
- `DELETE /:id` - Delete student
- `POST /bulk/delete` - Bulk delete students
- `POST /bulk/activate` - Bulk activate students
- `GET /export` - Export students to CSV

### Quizzes (`/api/quizzes`)
- `GET /` - Get all quizzes (Protected)
- `GET /:id` - Get quiz by ID (Protected)
- `POST /` - Create quiz (Admin)
- `PUT /:id` - Update quiz (Admin)
- `DELETE /:id` - Delete quiz (Admin)
- `POST /:id/send` - Send quiz to students (Admin)
- `GET /:id/stats` - Get quiz statistics (Admin)

### Analytics (`/api/analytics`) - Admin Only
- `GET /dashboard` - Dashboard statistics
- `GET /students` - Student analytics
- `GET /quizzes` - Quiz analytics

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is returned upon successful login/registration.

## 📊 Sample Requests

### Register Admin User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Create Student
```bash
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "school": "Example High School",
  "class": "10th Grade",
  "city": "New York",
  "state": "NY",
  "age": 16
}
```

### Create Quiz
```bash
POST /api/quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Math Assessment",
  "description": "Basic mathematics quiz",
  "category": "Academic",
  "questions": 20,
  "timeLimit": "30 mins",
  "status": "Active"
}
```

## 🛡️ Security Features

- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - 100 requests per 15 minutes on auth routes
- **Helmet** - Security headers
- **CORS** - Configured for frontend origin
- **Input Validation** - Mongoose schema validation

## 🧪 Testing

Test the API using:
- **Postman** - Import the endpoints
- **Thunder Client** - VS Code extension
- **cURL** - Command line testing

Health check:
```bash
curl http://localhost:5000/api/health
```

## 🐛 Error Handling

All errors return a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/quiz-portal` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiration time | `24h` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🚧 TODO

- [ ] Email service integration (Nodemailer)
- [ ] File upload for student avatars
- [ ] Quiz response submission endpoint
- [ ] Password reset functionality
- [ ] Unit tests
- [ ] API documentation (Swagger)

## 📄 License

ISC

## 👨‍💻 Author

Quiz Portal Development Team
