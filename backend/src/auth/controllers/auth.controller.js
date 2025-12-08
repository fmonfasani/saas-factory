const authService = require('../services/auth.service');

async function signup(req, res, next) {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    const user = await authService.signup({ email, password, firstName, lastName });
    
    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      user
    });
  } catch (error) {
    next(error);
  }
}

async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    };
    
    const { user, accessToken, refreshToken } = await authService.signin(email, password, deviceInfo);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      message: 'Login successful',
      user,
      accessToken
    });
  } catch (error) {
    next(error);
  }
}

async function signout(req, res, next) {
  try {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function resendVerification(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    
    const result = await authService.changePassword(userId, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        emailVerified: true,
        createdAt: true
      }
    });
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  signin,
  signout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe
};
