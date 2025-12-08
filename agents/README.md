# Agent Configuration: Deployer

This directory contains the configuration for the Deployer agent, a DevOps specialist focused on containerization, CI/CD pipelines, and cloud deployments.

## Configuration Details

- **Name**: deployer
- **Description**: DevOps Engineer especializado en containerización, CI/CD y deploy a múltiples plataformas cloud.
- **Tools**: Read, Write, Grep, Glob, Bash
- **System Prompt**: Detailed prompt defining the agent's capabilities and responsibilities

## Created Files

The deployer agent has created the following files for containerization, CI/CD, and deployment:

1. **Containerization Files:**
   - `Dockerfile.backend`: Optimized Dockerfile for the backend Node.js service
   - `Dockerfile.frontend`: Multi-stage Dockerfile for the frontend Next.js application
   - `docker-compose.yml`: Local development environment with app, database, and cache services
   - `.dockerignore`: Excludes unnecessary files from Docker builds

2. **CI/CD Pipeline Files:**
   - `.github/workflows/ci.yml`: Continuous integration pipeline with linting, testing, and building
   - `.github/workflows/deploy-staging.yml`: Automated staging deployment workflow
   - `.github/workflows/deploy-production.yml`: Production deployment with rollback capability

3. **Platform Configuration Files:**
   - `vercel.json`: Configuration for Vercel deployments
   - `railway.json`: Configuration for Railway deployments
   - `Procfile`: Process configuration for deployment platforms

## Capabilities

1. **Containerization (Docker)**
   - Optimized Dockerfiles for Node.js and Next.js
   - Local development with docker-compose
   - Proper .dockerignore configuration

2. **CI/CD Pipelines**
   - GitHub Actions automation
   - Parallel jobs for linting, testing, building, and deployment
   - Dependency caching for faster builds
   - Separate workflows for staging and production

3. **Multi-platform Deployments**
   - Vercel configuration
   - Railway setup
   - AWS ECS/Fargate with Terraform/CDK
   - DigitalOcean deployments

4. **Secrets Management**
   - Environment-specific variables
   - Secure secret storage using GitHub Secrets or platform vaults

5. **Post-deployment Monitoring**
   - Health checks
   - Logging integration
   - Error alerts with Sentry or similar services