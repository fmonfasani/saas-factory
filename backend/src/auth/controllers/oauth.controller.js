const passport = require('passport');
const { generateAccessToken, generateRefreshToken, createSession } = require('../services/jwt.service');

function googleAuth(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

async function googleCallback(req, res, next) {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    try {
      if (err || !user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Google authentication failed`);
      }
      
      const payload = {
        userId: user.id,
        email: user.email
      };
      
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken({ userId: user.id });
      
      const deviceInfo = {
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress
      };
      
      await createSession(user.id, refreshToken, deviceInfo);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
}

function githubAuth(req, res, next) {
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
}

async function githubCallback(req, res, next) {
  passport.authenticate('github', { session: false }, async (err, user, info) => {
    try {
      if (err || !user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=GitHub authentication failed`);
      }
      
      const payload = {
        userId: user.id,
        email: user.email
      };
      
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken({ userId: user.id });
      
      const deviceInfo = {
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress
      };
      
      await createSession(user.id, refreshToken, deviceInfo);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
}

module.exports = {
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback
};
