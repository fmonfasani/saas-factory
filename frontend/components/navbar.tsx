import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              SaaS Factory
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blueprints"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Blueprints
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/signin"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-gray-700 hover:text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}