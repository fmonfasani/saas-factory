export interface SaaSData {
  name: string;
  idea: string;
  market: string;
  core_features: string;
  tech_stack: string;
  mvp_plan: string;
  gtm_plan: string;
}

export interface GeneratedSaaSData {
  name: string;
  tagline: string;
  description: string;
  market: string;
  targetAudience: string;
  problemStatement: string;
  solution: string;
  features: string[];
  mvpFeatures: string[];
  usp: string;
  pricingModel: string;
  cta: string;
  // Optional fields that might be added later or used in UI
  idea?: string;
  generatedSchema?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface AgentEvent {
  type: string;
  agent?: string;
  message: string;
  timestamp: Date;
  data?: any;
}

// Auth Types
export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignupResponse {
  message: string;
  user: User;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface ValidationError {
  msg: string;
  param: string;
  location: string;
}

export interface ErrorResponse {
  error?: string;
  errors?: ValidationError[];
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  role: 'owner' | 'admin' | 'member' | 'guest';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  idea?: string;
  market?: string;
  coreFeatures?: string;
  techStack?: string;
  mvpPlan?: string;
  gtmPlan?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
}