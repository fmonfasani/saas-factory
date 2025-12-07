import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your SaaS Landing Page
            <span className="block text-primary mt-2">In Minutes</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your SaaS ideas into beautiful, professional landing pages automatically. 
            Connect with Google Sheets and generate stunning pages instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              href="/pricing"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-primary shadow-lg"
            >
              View Pricing
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate landing pages in seconds with our automated system</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
              <p className="text-gray-600">Modern, responsive designs that convert visitors to customers</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">Connect with Google Sheets and manage your SaaS data effortlessly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
