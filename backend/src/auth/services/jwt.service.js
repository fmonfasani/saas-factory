const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES
  });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

async function createSession(userId, refreshToken, deviceInfo = {}) {
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  return await prisma.session.create({
    data: {
      userId,
      refreshToken: hashedRefreshToken,
      userAgent: deviceInfo.userAgent,
      ip: deviceInfo.ip,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      expiresAt
    }
  });
}

async function deleteSession(sessionId) {
  return await prisma.session.delete({
    where: { id: sessionId }
  });
}

async function deleteUserSessions(userId) {
  return await prisma.session.deleteMany({
    where: { userId }
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createSession,
  deleteSession,
  deleteUserSessions
};
