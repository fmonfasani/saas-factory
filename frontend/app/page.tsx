import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to create your SaaS landing page
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Your SaaS Data</h3>
              <p className="text-gray-600">
                Enter your SaaS details in Google Sheets: name, idea, market, features, tech stack, and plans.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Landing Page</h3>
              <p className="text-gray-600">
                Our system automatically reads your data and generates a professional landing page.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Launch & Share</h3>
              <p className="text-gray-600">
                Preview your landing page and share it with the world to start getting customers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Features That Make Us Different
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create stunning SaaS landing pages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-primary text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Google Sheets Integration</h3>
              <p className="text-gray-600">
                Seamlessly connect with Google Sheets to manage your SaaS database.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-primary text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Auto-Generation</h3>
              <p className="text-gray-600">
                Automatically generate landing pages from your SaaS data in seconds.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-primary text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">Fully Responsive</h3>
              <p className="text-gray-600">
                All landing pages are mobile-friendly and look great on any device.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-primary text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Modern Design</h3>
              <p className="text-gray-600">
                Clean, professional designs that help convert visitors into customers.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-primary text-3xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-3">Easy Customization</h3>
              <p className="text-gray-600">
                Update your Google Sheets and regenerate pages instantly.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-primary text-3xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-3">Business Ready</h3>
              <p className="text-gray-600">
                Include market analysis, features, MVP plans, and GTM strategy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
