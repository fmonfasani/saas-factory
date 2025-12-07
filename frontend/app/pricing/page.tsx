export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out SaaS Factory',
      features: [
        'Up to 3 SaaS projects',
        '5 landing page generations/month',
        'Google Sheets integration',
        'Basic templates',
        'Community support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'For serious entrepreneurs',
      features: [
        'Unlimited SaaS projects',
        'Unlimited landing page generations',
        'Google Sheets integration',
        'Premium templates',
        'Custom branding',
        'Priority support',
        'Analytics dashboard',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For teams and agencies',
      features: [
        'Everything in Professional',
        'Team collaboration',
        'White-label solution',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                plan.highlighted
                  ? 'ring-4 ring-primary transform scale-105'
                  : ''
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/ {plan.period}</span>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-8 ${
                    plan.highlighted
                      ? 'bg-primary text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            All Plans Include
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div>
              <div className="text-primary text-3xl mb-2">🔒</div>
              <h4 className="font-semibold mb-1">Secure & Reliable</h4>
              <p className="text-gray-600 text-sm">99.9% uptime guarantee</p>
            </div>
            <div>
              <div className="text-primary text-3xl mb-2">🚀</div>
              <h4 className="font-semibold mb-1">Fast Performance</h4>
              <p className="text-gray-600 text-sm">Lightning-fast generation</p>
            </div>
            <div>
              <div className="text-primary text-3xl mb-2">📱</div>
              <h4 className="font-semibold mb-1">Mobile Responsive</h4>
              <p className="text-gray-600 text-sm">Works on all devices</p>
            </div>
            <div>
              <div className="text-primary text-3xl mb-2">🔄</div>
              <h4 className="font-semibold mb-1">Regular Updates</h4>
              <p className="text-gray-600 text-sm">New features monthly</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto text-left space-y-4">
            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                Can I switch plans later?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-3 text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer">
                Is there a free trial?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes! All paid plans include a 14-day free trial. No credit card required.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
