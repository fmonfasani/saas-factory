require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const organizationRoutes = require('./routes/organization.routes');
const projectRoutes = require('./routes/project.routes');
const generateRoutes = require('./routes/generate.routes');
const billingRoutes = require('./routes/billing.routes');

require('./auth/strategies/jwt.strategy');
require('./auth/strategies/google.strategy');
require('./auth/strategies/github.strategy');

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const apiPrefix = process.env.API_PREFIX || '/api';
app.get(`${apiPrefix}`, (req, res) => {
  res.json({
    message: 'Welcome to SaaS Factory API',
    version: '1.0.0',
    endpoints: {
      auth: `${apiPrefix}/auth`,
      users: `${apiPrefix}/users`,
      organizations: `${apiPrefix}/organizations`,
      generate: `${apiPrefix}/generate`,
      billing: `${apiPrefix}/billing`,
      health: '/health'
    }
  });
});

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/organizations`, organizationRoutes);
app.use(`${apiPrefix}/organizations/:orgId/projects`, projectRoutes);
app.use(`${apiPrefix}/generate`, generateRoutes);
app.use(`${apiPrefix}/billing`, billingRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;