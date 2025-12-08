# API Endpoints Report

## Overview
This document provides a comprehensive overview of all API endpoints in the SaaS Factory application, including their methods, paths, parameters, and expected responses.

## Base URL
All endpoints are prefixed with `/api` and are accessible at:
```
http://localhost:5000/api/[endpoint]
```

## Authentication Endpoints
### POST /auth/signup
- **Description**: Register a new user account
- **Parameters**:
  - `email` (string, required): User's email address
  - `password` (string, required): User's password (min 6 characters)
  - `firstName` (string, required): User's first name
  - `lastName` (string, required): User's last name
- **Responses**:
  - 201: Successfully created user account
  - 400: Validation error or missing fields
  - 409: Email already exists

### POST /auth/signin
- **Description**: Authenticate user and generate JWT token
- **Parameters**:
  - `email` (string, required): User's email address
  - `password` (string, required): User's password
- **Responses**:
  - 200: Successful authentication with JWT token
  - 400: Missing credentials
  - 401: Invalid email or password
  - 403: Email not verified

### POST /auth/signout
- **Description**: Sign out user and invalidate session
- **Responses**:
  - 200: Successfully signed out

### GET /auth/me
- **Description**: Get current authenticated user's profile
- **Authentication**: Required (JWT token)
- **Responses**:
  - 200: Current user's profile data
  - 401: Unauthorized

### GET /auth/verify-email
- **Description**: Verify user's email address
- **Parameters**:
  - `token` (string, required): Email verification token
- **Responses**:
  - 200: Email successfully verified
  - 400: Invalid or expired token

### POST /auth/resend-verification
- **Description**: Resend email verification link
- **Parameters**:
  - `email` (string, required): User's email address
- **Responses**:
  - 200: Verification email sent
  - 400: Invalid email or already verified

### POST /auth/forgot-password
- **Description**: Request password reset link
- **Parameters**:
  - `email` (string, required): User's email address
- **Responses**:
  - 200: Password reset email sent
  - 400: Invalid email

### POST /auth/reset-password
- **Description**: Reset user's password
- **Parameters**:
  - `token` (string, required): Password reset token
  - `password` (string, required): New password
- **Responses**:
  - 200: Password successfully reset
  - 400: Invalid or expired token

### POST /auth/change-password
- **Description**: Change authenticated user's password
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `currentPassword` (string, required): Current password
  - `newPassword` (string, required): New password
- **Responses**:
  - 200: Password successfully changed
  - 400: Invalid current password
  - 401: Unauthorized

### GET /auth/google
- **Description**: Initiate Google OAuth authentication
- **Responses**:
  - 302: Redirect to Google OAuth

### GET /auth/google/callback
- **Description**: Handle Google OAuth callback
- **Responses**:
  - 302: Redirect to dashboard on success
  - 302: Redirect to signin on failure

### GET /auth/github
- **Description**: Initiate GitHub OAuth authentication
- **Responses**:
  - 302: Redirect to GitHub OAuth

### GET /auth/github/callback
- **Description**: Handle GitHub OAuth callback
- **Responses**:
  - 302: Redirect to dashboard on success
  - 302: Redirect to signin on failure

## User Profile Endpoints
### GET /users/profile
- **Description**: Get authenticated user's profile
- **Authentication**: Required (JWT token)
- **Responses**:
  - 200: User profile data
  - 401: Unauthorized

### PUT /users/profile
- **Description**: Update authenticated user's profile
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `firstName` (string, optional): User's first name
  - `lastName` (string, optional): User's last name
  - `bio` (string, optional): User's biography
- **Responses**:
  - 200: Updated profile data
  - 400: Validation error
  - 401: Unauthorized

## Organization Endpoints
### GET /organizations
- **Description**: Get all organizations for authenticated user
- **Authentication**: Required (JWT token)
- **Responses**:
  - 200: Array of organizations
  - 401: Unauthorized

### POST /organizations
- **Description**: Create a new organization
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `name` (string, required): Organization name
  - `description` (string, optional): Organization description
- **Responses**:
  - 201: Created organization
  - 400: Validation error
  - 401: Unauthorized

### GET /organizations/:id
- **Description**: Get specific organization by ID
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `id` (string, required): Organization ID
- **Responses**:
  - 200: Organization data
  - 401: Unauthorized
  - 403: Forbidden (not member of organization)
  - 404: Organization not found

### PUT /organizations/:id
- **Description**: Update organization
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `id` (string, required): Organization ID
  - `name` (string, optional): Organization name
  - `description` (string, optional): Organization description
- **Responses**:
  - 200: Updated organization
  - 400: Validation error
  - 401: Unauthorized
  - 403: Forbidden (not owner/admin)
  - 404: Organization not found

### DELETE /organizations/:id
- **Description**: Delete organization
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `id` (string, required): Organization ID
- **Responses**:
  - 204: Organization deleted
  - 401: Unauthorized
  - 403: Forbidden (not owner)
  - 404: Organization not found

### POST /organizations/:id/members
- **Description**: Add member to organization
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `id` (string, required): Organization ID
  - `email` (string, required): Member's email
  - `role` (string, required): Member role (owner, admin, member)
- **Responses**:
  - 200: Member added
  - 400: Validation error
  - 401: Unauthorized
  - 403: Forbidden (not owner/admin)
  - 404: Organization not found

### DELETE /organizations/:id/members/:userId
- **Description**: Remove member from organization
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `id` (string, required): Organization ID
  - `userId` (string, required): User ID to remove
- **Responses**:
  - 204: Member removed
  - 401: Unauthorized
  - 403: Forbidden (not owner/admin)
  - 404: Organization or user not found

## Project Endpoints
### GET /organizations/:orgId/projects
- **Description**: Get all projects for an organization
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `orgId` (string, required): Organization ID
- **Responses**:
  - 200: Array of projects
  - 401: Unauthorized
  - 403: Forbidden (not member of organization)
  - 404: Organization not found

### POST /organizations/:orgId/projects
- **Description**: Create a new project in an organization
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `orgId` (string, required): Organization ID
  - `name` (string, required): Project name
  - `description` (string, optional): Project description
- **Responses**:
  - 201: Created project
  - 400: Validation error
  - 401: Unauthorized
  - 403: Forbidden (not member of organization)
  - 404: Organization not found

### GET /organizations/:orgId/projects/:id
- **Description**: Get specific project by ID
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `orgId` (string, required): Organization ID
  - `id` (string, required): Project ID
- **Responses**:
  - 200: Project data
  - 401: Unauthorized
  - 403: Forbidden (not member of organization)
  - 404: Organization or project not found

### PUT /organizations/:orgId/projects/:id
- **Description**: Update project
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `orgId` (string, required): Organization ID
  - `id` (string, required): Project ID
  - `name` (string, optional): Project name
  - `description` (string, optional): Project description
- **Responses**:
  - 200: Updated project
  - 400: Validation error
  - 401: Unauthorized
  - 403: Forbidden (not member of organization)
  - 404: Organization or project not found

### DELETE /organizations/:orgId/projects/:id
- **Description**: Delete project
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `orgId` (string, required): Organization ID
  - `id` (string, required): Project ID
- **Responses**:
  - 204: Project deleted
  - 401: Unauthorized
  - 403: Forbidden (not member of organization)
  - 404: Organization or project not found

## Generate Endpoints
### POST /generate/analyze
- **Description**: Analyze SaaS idea prompt and extract key components
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `prompt` (string, required): SaaS idea description
- **Responses**:
  - 200: Analysis results with extracted components
  - 400: Missing prompt
  - 401: Unauthorized

### POST /generate/landing
- **Description**: Generate landing page based on SaaS analysis
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `analysisData` (object, required): Previously analyzed SaaS data
- **Responses**:
  - 200: Landing page generation initiated
  - 400: Missing analysis data
  - 401: Unauthorized

### GET /generate/status/:jobId
- **Description**: Get status of generation job
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `jobId` (string, required): Generation job ID
- **Responses**:
  - 200: Job status and progress
  - 401: Unauthorized
  - 404: Job not found

### GET /generate/stream/:jobId
- **Description**: Stream real-time updates for generation job
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `jobId` (string, required): Generation job ID
- **Responses**:
  - 200: Server-Sent Events stream
  - 401: Unauthorized
  - 404: Job not found

### GET /generate/rate
- **Description**: Get current rate limits for generation
- **Authentication**: Required (JWT token)
- **Responses**:
  - 200: Rate limit information
  - 401: Unauthorized

### POST /generate/ab-results
- **Description**: Submit A/B test results for generated landing page
- **Authentication**: Required (JWT token)
- **Parameters**:
  - `jobId` (string, required): Generation job ID
  - `version` (string, required): Landing page version (A or B)
  - `metrics` (object, required): Test results metrics
- **Responses**:
  - 200: Results recorded
  - 400: Missing required fields
  - 401: Unauthorized
  - 404: Job not found