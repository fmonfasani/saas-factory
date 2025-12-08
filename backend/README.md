# SaaS Factory Backend API

Node.js/Express authentication and API backend for SaaS Factory.

## Features

- ✅ JWT Authentication (stateless)
- ✅ Email/Password signup & signin
- ✅ OAuth 2.0 (Google, GitHub)
- ✅ Email verification
- ✅ Password reset/recovery
- ✅ Account lockout (brute force protection)
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ CORS configured
- ✅ Input validation & sanitization
- ✅ Refresh tokens (httpOnly cookies)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Passport.js + JWT
- **Email**: Nodemailer
- **Security**: bcrypt, helmet, express-rate-limit

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET`: Secret for refresh tokens (min 32 chars)
- Google OAuth credentials
- GitHub OAuth credentials
- SMTP email configuration

### 3. Set up database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Configure OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
3. Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication

**POST** `/api/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**POST** `/api/auth/signin`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**POST** `/api/auth/signout`

**GET** `/api/auth/me` (Protected)

**PUT** `/api/auth/profile` (Protected)
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Email Verification

**POST** `/api/auth/verify-email`
```json
{
  "token": "verification-token"
}
```

**POST** `/api/auth/resend-verification`
```json
{
  "email": "user@example.com"
}
```

### Password Management

**POST** `/api/auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```

**POST** `/api/auth/reset-password`
```json
{
  "token": "reset-token",
  "password": "NewSecurePass123!"
}
```

**POST** `/api/auth/change-password` (Protected)
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass123!"
}
```

### OAuth

**GET** `/api/auth/google`  
Redirects to Google OAuth

**GET** `/api/auth/google/callback`  
Google OAuth callback (redirects to frontend)

**GET** `/api/auth/github`  
Redirects to GitHub OAuth

**GET** `/api/auth/github/callback`  
GitHub OAuth callback (redirects to frontend)

### User Profile

**GET** `/api/users/profile` (Protected)

**PUT** `/api/users/profile` (Protected)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

## Security Features

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Rate Limiting

- Login: 5 attempts per 15 minutes
- Signup: 3 attempts per hour
- Password reset: 3 attempts per hour

### Account Lockout

- 5 failed login attempts = 15 minute lockout
- Resets on successful login

### JWT Tokens

- Access token: 15 minutes (short-lived)
- Refresh token: 7 days (httpOnly cookie)

## Database Schema

### User Model

- `id`: UUID primary key
- `email`: Unique, indexed
- `password`: bcrypt hashed (12 rounds)
- `firstName`, `lastName`, `avatar`
- `emailVerified`, `emailVerificationToken`
- `passwordResetToken`, `passwordResetExpires`
- `googleId`, `githubId` (OAuth)
- `lastLogin`, `loginAttempts`, `lockUntil`
- Timestamps: `createdAt`, `updatedAt`

### Session Model

- `id`: UUID primary key
- `userId`: Foreign key to User
- `refreshToken`: Hashed
- Device info: `userAgent`, `ip`, `device`, `browser`, `os`
- `expiresAt`, `createdAt`

## Error Handling

All errors return JSON:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (authenticated but no permission)
- `404`: Not Found
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
COOKIE_SECURE=true  # Enable for HTTPS
FRONTEND_URL=https://yourdomain.com
```

### Database Migration

```bash
npm run prisma:migrate
```

## Integration with Frontend

The frontend expects:
- API at `http://localhost:5000/api`
- Access token in `Authorization: Bearer <token>` header
- Refresh token in httpOnly cookie
- OAuth success redirects to `/auth/success?token=<accessToken>`
- OAuth error redirects to `/auth/error?message=<error>`

## License

MIT

## Author

Federico Monfasani
