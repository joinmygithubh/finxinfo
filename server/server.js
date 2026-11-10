const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Smart environment variables loader: checks root .env first, then server/.env
const rootEnvPath = path.resolve(__dirname, '../.env');
const serverEnvPath = path.resolve(__dirname, '.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Express trust proxy for Hostinger reverse proxies (NGINX / LiteSpeed / Cloudflare)
// This ensures real client IPs are used for rate limiting and secure protocol detection
app.set('trust proxy', 1);

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
    contentSecurityPolicy: false, // Allows Cashfree JS SDK and external resource loading
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, same-origin browser calls)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Allow client requests
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers with raw body preservation for Cashfree webhook signature verification
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
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
app.use('/api/payments', paymentRoutes);

// Dedicated 404 handler for unmatched /api requests (always returns JSON)
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Serve frontend static build files (client/dist)
const clientDistPath = path.resolve(__dirname, '../client/dist');
const rootDistPath = path.resolve(__dirname, '../dist');
const distPath = fs.existsSync(clientDistPath) ? clientDistPath : rootDistPath;

if (fs.existsSync(distPath)) {
  app.use(
    express.static(distPath, {
      maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
      etag: true,
      index: false, // SPA fallback handles index.html for client-side routing
    })
  );
  console.log(`[Static Files] Serving production frontend build from: ${distPath}`);
} else {
  console.warn(`[Static Files Warning] Frontend build directory not found at: ${distPath}. Run "npm run build" to compile client.`);
}

// SPA Fallback Routing: For any non-API GET request, serve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return res.status(404).send(
    'FinXinfo frontend build is not found. Please run "npm run build" to build the client.'
  );
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

// Start listening on process.env.PORT
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` FinXinfo Production Server Active`);
  console.log(` Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health Check: /api/health`);
  console.log(`====================================================`);
});

module.exports = app;
