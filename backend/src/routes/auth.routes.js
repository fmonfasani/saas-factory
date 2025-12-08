const express = require('express');
const router = express.Router();
const authController = require('../auth/controllers/auth.controller');
const oauthController = require('../auth/controllers/oauth.controller');
const { authenticateJWT } = require('../auth/middleware/auth.middleware');
const { loginLimiter, signupLimiter, resetPasswordLimiter } = require('../auth/middleware/rate-limit.middleware');
const {
  signupValidation,
  signinValidation,
  emailValidation,
  tokenValidation,
  resetPasswordValidation,
  changePasswordValidation,
  validate
} = require('../auth/middleware/validate.middleware');

router.post('/signup', signupLimiter, signupValidation, validate, authController.signup);

router.post('/signin', loginLimiter, signinValidation, validate, authController.signin);

router.post('/signout', authController.signout);

router.post('/verify-email', tokenValidation, validate, authController.verifyEmail);

router.post('/resend-verification', emailValidation, validate, authController.resendVerification);

router.post('/forgot-password', resetPasswordLimiter, emailValidation, validate, authController.forgotPassword);

router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

router.post('/change-password', authenticateJWT, changePasswordValidation, validate, authController.changePassword);

router.get('/me', authenticateJWT, authController.getMe);

router.get('/google', oauthController.googleAuth);
router.get('/google/callback', oauthController.googleCallback);

router.get('/github', oauthController.githubAuth);
router.get('/github/callback', oauthController.githubCallback);

module.exports = router;
