import { Link } from 'react-router-dom'

interface CommonLayoutProps {
  children: React.ReactNode
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:text-blue-600">
              Car Renting
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <Link to="/cars" className="hover:text-blue-600">Cars</Link>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 mt-auto py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Car Renting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

