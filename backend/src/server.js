require('dotenv').config();
console.log('🔄 Starting server initialization...');
console.log(`📍 Node version: ${process.version}`);
console.log(`📍 Environment: ${process.env.NODE_ENV}`);
console.log(`📍 PORT env: ${process.env.PORT}`);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const quizRoutes = require('./routes/quizRoutes');

const analyticsRoutes = require('./routes/analyticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Trust proxy for Railway/Vercel (required for rate limiting)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    // Remove trailing slash if present to avoid CORS mismatch
    (process.env.FRONTEND_URL || '').replace(/\/$/, ''),
].filter(Boolean);

console.log('📍 Allowed CORS origins:', allowedOrigins);

//ervgwsdf

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log('❌ CORS blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/auth', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route - placed BEFORE other routes for quick response
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Quiz Portal API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// START SERVER FIRST, then connect to database
// This ensures Railway health check passes immediately
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

    // Connect to database AFTER server is listening
    console.log('🔌 Connecting to MongoDB...');
    connectDB()
        .then(() => {
            console.log('✅ Database connection established');
        })
        .catch((err) => {
            console.error('❌ Database connection failed:', err.message);
            // Don't exit - let the server keep running for health checks
        });
});
