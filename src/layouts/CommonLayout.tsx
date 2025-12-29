import { Link , useNavigate} from 'react-router-dom'
import { Home, Car, LogIn, LayoutDashboard, LogOut } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

interface CommonLayoutProps {
  children: React.ReactNode
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  const { token, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
      
            <Link 
              to="/" 
              className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Car Renting      
            </Link>
         
            
            <div className="flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Home className="h-4 w-4 text-purple-500" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/cars" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <Car className="h-4 w-4 text-purple-500" />
                <span>Cars</span>
              </Link>
              
              {/* Dashboard Link (only when logged in) */}
              {token && user && (
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-purple-500" />
                  <span>Dashboard</span>
                  {user.role && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 font-medium">
                      {user.role}
                    </span>
                  )}
                </Link>
              )}
              
              {/* Login/Logout Button */}
              {token ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* User Info Bar */}
       
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 mt-auto py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-1 w-16 bg-purple-300 rounded-full"></div>
            <p className="text-gray-600">
              &copy; 2024 Car Renting. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Experience luxury with our premium car collection
            </p>
            {token && user && (
              <div className="flex items-center gap-4 text-sm text-purple-600">
                <span>Logged in as: {user.email}</span>
                <span className="h-4 w-px bg-purple-200"></span>
                <span>Role: {user.role}</span>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}