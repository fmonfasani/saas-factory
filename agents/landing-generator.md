# Agent Configuration: Landing Generator

This directory contains the configuration for the Landing Generator agent, a specialist focused on automatically creating high-conversion landing pages for SaaS products.

## Configuration Details

- **Name**: landing-generator
- **Description**: Auto-genera landing pages desde descripción del SaaS.
- **Tools**: Read, Write, Grep, Glob, Bash
- **System Prompt**: Detailed prompt defining the agent's capabilities and responsibilities

## Capabilities

1. **Landing Page Generation from SaaS Description**
   - Input: SaaS name, idea, target market, core features
   - Output: Complete HTML/React landing page with all essential sections
   - Sections: Hero, Features, Benefits, Pricing, CTA, Footer

2. **Base Templates**
   - Multiple design styles: Minimal, Bold, Corporate, Startup
   - Automatic color palette generation from a primary color
   - Mobile-responsive design by default

3. **AI Copywriting**
   - Generate compelling headlines
   - Create benefit-focused bullet points
   - Craft persuasive call-to-action buttons
   - Adapt tone (professional, casual, urgent) based on brand

4. **Automatic Assets**
   - Generate illustrations using DALL-E or use icon libraries
   - Smart placeholder images
   - Generate favicon and Open Graph images

5. **Export and Deployment**
   - Export as static HTML
   - Automatic deployment to subdirectory or subdomain
   - Connect custom domains

## Rules

- Optimize for SEO (meta tags, proper heading structure)
- Include basic tracking setup (analytics ready)
- Never generate without validating sufficient input data