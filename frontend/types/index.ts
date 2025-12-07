export interface SaaSData {
  name: string;
  idea: string;
  market: string;
  core_features: string;
  tech_stack: string;
  mvp_plan: string;
  gtm_plan: string;
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
