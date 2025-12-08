const rateLimit = require('express-rate-limit');

// In development, relax rate limits to avoid blocking tests
const isDevelopment = process.env.NODE_ENV === 'development';
const loginMax = isDevelopment ? 100 : 5;
const signupMax = isDevelopment ? 100 : 3;
const resetPasswordMax = isDevelopment ? 100 : 3;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: loginMax,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: signupMax,
  message: 'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false
});

const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: resetPasswordMax,
  message: 'Too many password reset requests from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  signupLimiter,
  resetPasswordLimiter
};