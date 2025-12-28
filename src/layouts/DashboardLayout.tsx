import { Link } from 'react-router-dom'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-xl font-bold hover:text-blue-600">
              Dashboard
            </Link>
            <div className="flex gap-4">
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/rent-car"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Rent Car
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

