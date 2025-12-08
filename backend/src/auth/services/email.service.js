const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.FRONTEND_VERIFY_EMAIL_URL}?token=${token}`;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email - SaaS Factory',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to SaaS Factory!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background: #0055ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 48 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_HOST || !process.env.EMAIL_USER)) {
      console.log('✉️ [DEV MODE] Email Verification skipped. URL:', verificationUrl);
      return;
    }
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // In dev, we don't want to block signup if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('✉️ [DEV MODE] Mock email sent. Verify URL:', verificationUrl);
    } else {
      throw error;
    }
  }
}

async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_RESET_PASSWORD_URL}?token=${token}`;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset your password - SaaS Factory',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #0055ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_HOST || !process.env.EMAIL_USER)) {
      console.log('✉️ [DEV MODE] Password Reset Email skipped. URL:', resetUrl);
      return;
    }
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // In dev, we don't want to block operations if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('✉️ [DEV MODE] Mock password reset email sent. Reset URL:', resetUrl);
    } else {
      throw error;
    }
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};