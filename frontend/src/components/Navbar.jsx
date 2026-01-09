import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-dark sticky top-0 z-50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold neon-text">
            ✈️ Voyago
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-cyan-400 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/destinations"
              className="hover:text-cyan-400 transition-colors duration-300"
            >
              Destinations
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="hover:text-cyan-400 transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="hover:text-cyan-400 transition-colors duration-300"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300 hidden md:block">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

