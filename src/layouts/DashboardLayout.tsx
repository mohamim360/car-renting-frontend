import { Link } from 'react-router-dom'
import { LayoutDashboard, KeyRound, Car as CarIcon, Menu, Home, Users, Settings, BarChart3, UserCog } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)

  const getSidebarLinks = () => {
    if (!user) return []

    const commonLinks = [
      {
        to: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5 text-purple-500" />,
        label: "Dashboard Overview",
        roles: ['user', 'admin', 'driver']
      }
    ]

    const userLinks = [
      {
        to: "/dashboard/rent-car",
        icon: <KeyRound className="h-5 w-5 text-purple-500" />,
        label: "Rent a Car",
        roles: ['user']
      },
      {
        to: "/dashboard/my-cars",
        icon: <CarIcon className="h-5 w-5 text-purple-500" />,
        label: "My Rentals",
        roles: ['user']
      }
    ]

    const adminLinks = [
      {
        to: "/dashboard/admin",
        icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
        label: "Admin Dashboard",
        roles: ['admin']
      },
      {
        to: "/dashboard/admin/cars-management",
        icon: <CarIcon className="h-5 w-5 text-purple-500" />,
        label: "Manage Cars",
        roles: ['admin']
      },
      {
        to: "/dashboard/admin/users-management",
        icon: <Users className="h-5 w-5 text-purple-500" />,
        label: "Manage Users",
        roles: ['admin']
      },
      {
        to: "/dashboard/admin/rents-management",
        icon: <KeyRound className="h-5 w-5 text-purple-500" />,
        label: "Manage Rentals",
        roles: ['admin']
      }
    ]

    const driverLinks = [
      {
        to: "/dashboard/driver",
        icon: <CarIcon className="h-5 w-5 text-purple-500" />,
        label: "Driver Dashboard",
        roles: ['driver']
      },
      {
        to: "/dashboard/driver/my-assignments",
        icon: <KeyRound className="h-5 w-5 text-purple-500" />,
        label: "My Assignments",
        roles: ['driver']
      }
    ]

    // Combine all links that match user's role
    return [
      ...commonLinks,
      ...userLinks,
      ...adminLinks,
      ...driverLinks
    ].filter(link => link.roles.includes(user.role))
  }

  const sidebarLinks = getSidebarLinks()

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
              <div className="flex flex-col">
                <Link 
                  to="/dashboard" 
                  className="text-xl font-bold text-purple-600"
                >
                  Dashboard
                </Link>
             
              </div>
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
          <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="font-bold text-purple-600">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors group"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
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