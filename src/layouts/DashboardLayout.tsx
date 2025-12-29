import { Link } from 'react-router-dom'
import { LayoutDashboard, KeyRound, Car as CarIcon, Menu,Home } from 'lucide-react'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Dashboard Navbar */}
      <nav className="bg-white border-b border-purple-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-purple-50 text-purple-600"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link 
                to="/dashboard" 
                className="text-xl font-bold text-purple-600"
              >
                Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-4">
            <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Home className="h-4 w-4 text-purple-500" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static lg:w-64 bg-white border-r border-purple-100 shadow-sm
          min-h-[calc(100vh-64px)] p-4 z-40 transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="space-y-2 mt-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5 text-purple-500" />
              <span>Dashboard Overview</span>
            </Link>
            <Link
              to="/dashboard/rent-car"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <KeyRound className="h-5 w-5 text-purple-500" />
              <span>Rent a Car</span>
            </Link>
            <Link
              to="/dashboard/my-cars"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <CarIcon className="h-5 w-5 text-purple-500" />
              <span>My Rentals</span>
            </Link>
          </nav>
          
          {/* Sidebar decorative element */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-200"></div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-4 lg:p-6 min-h-[calc(100vh-100px)]">
            {children}
          </div>
          
        </main>
      </div>
    </div>
  )
}