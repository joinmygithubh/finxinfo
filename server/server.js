const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB().then(async () => {
  // Ensure default administrator account exists
  try {
    const adminEmail = 'admin@quickadvisorusa.com';
    const exists = await Admin.findOne({ email: adminEmail });
    if (!exists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin@QuickAdvisor2025!', salt);
      await Admin.create({
        name: 'QuickAdvisor Executive Admin',
        email: adminEmail,
        passwordHash,
        role: 'superadmin',
      });
      console.log(`[Bootstrap] Default admin created: ${adminEmail}`);
    }
  } catch (seedErr) {
    console.error('[Bootstrap Error]:', seedErr.message);
  }
});

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible client resource loading
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General rate limiter for all /api endpoints
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'FinXinfo API Server',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/newsletter', newsletterRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Exception]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` FinXinfo API running on port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

