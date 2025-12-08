const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../../utils/password.util');
const { generateToken, generateTokenExpiry } = require('../../utils/token.util');
const { generateAccessToken, generateRefreshToken, createSession } = require('./jwt.service');
const emailService = require('./email.service');
const { createOrganizationWithOwner } = require('../../organizations/services/organization.service');
const AppError = require('../../utils/AppError');

const prisma = new PrismaClient();

async function signup(data) {
  const { email, password, firstName, lastName } = data;
  
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }
  
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    throw new AppError(400, passwordValidation.message);
  }
  
  const hashedPassword = await hashPassword(password);
  const emailVerificationToken = generateToken();
  const emailVerificationExpires = generateTokenExpiry(48);
  
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      emailVerificationToken,
      emailVerificationExpires
    }
  });
  
  // Automatically create organization for the user
  const organizationName = `${firstName}'s Workspace`;
  await createOrganizationWithOwner({
    name: organizationName,
    userId: user.id
  });
  
  await emailService.sendVerificationEmail(user.email, emailVerificationToken);
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function signin(email, password, deviceInfo = {}) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }
  
  if (user.lockUntil && user.lockUntil > new Date()) {
    const remainingTime = Math.ceil((user.lockUntil - new Date()) / 60000);
    throw new AppError(423, `Account locked. Try again in ${remainingTime} minutes`);
  }
  
  if (!user.password) {
    throw new AppError(400, 'Please sign in with your OAuth provider (Google or GitHub)');
  }
  
  const isValidPassword = await comparePassword(password, user.password);
  
  if (!isValidPassword) {
    const loginAttempts = user.loginAttempts + 1;
    const lockUntil = loginAttempts >= 5 
      ? new Date(Date.now() + 15 * 60 * 1000)
      : null;
    
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts, lockUntil }
    });
    
    throw new AppError(401, 'Invalid credentials');
  }
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: new Date()
    }
  });
  
  const payload = {
    userId: user.id,
    email: user.email
  };
  
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: user.id });
  
  await createSession(user.id, refreshToken, deviceInfo);
  
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken
  };
}

async function verifyEmail(token) {
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: { gt: new Date() }
    }
  });
  
  if (!user) {
    throw new AppError(400, 'Invalid or expired verification token');
  }
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    }
  });
  
  return { message: 'Email verified successfully' };
}

async function resendVerification(email) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  
  if (user.emailVerified) {
    throw new AppError(400, 'Email already verified');
  }
  
  const emailVerificationToken = generateToken();
  const emailVerificationExpires = generateTokenExpiry(48);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken, emailVerificationExpires }
  });
  
  await emailService.sendVerificationEmail(user.email, emailVerificationToken);
  
  return { message: 'Verification email sent' };
}

async function forgotPassword(email) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (!user) {
    return { message: 'If the email exists, a reset link has been sent' };
  }
  
  const passwordResetToken = generateToken();
  const passwordResetExpires = generateTokenExpiry(1);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken, passwordResetExpires }
  });
  
  await emailService.sendPasswordResetEmail(user.email, passwordResetToken);
  
  return { message: 'If the email exists, a reset link has been sent' };
}

async function resetPassword(token, newPassword) {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() }
    }
  });
  
  if (!user) {
    throw new AppError(400, 'Invalid or expired reset token');
  }
  
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.valid) {
    throw new AppError(400, passwordValidation.message);
  }
  
  const hashedPassword = await hashPassword(newPassword);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    }
  });
  
  return { message: 'Password reset successfully' };
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user || !user.password) {
    throw new AppError(404, 'User not found or uses OAuth');
  }
  
  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new AppError(400, 'Current password is incorrect');
  }
  
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.valid) {
    throw new AppError(400, passwordValidation.message);
  }
  
  const hashedPassword = await hashPassword(newPassword);
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
  
  return { message: 'Password changed successfully' };
}

module.exports = {
  signup,
  signin,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword
};