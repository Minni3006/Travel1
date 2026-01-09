import { Link } from 'react-router-dom'
import { FaTwitter, FaInstagram, FaFacebook, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-transparent to-black/50 border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold neon-text mb-4">Voyago</h3>
            <p className="text-gray-400 text-sm">
              Your gateway to amazing travel experiences around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:support@voyago-travel.com"
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm group"
              >
                <FaEnvelope className="group-hover:scale-110 transition-transform" />
                <span>support@voyago-travel.com</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/explore"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-full hover:bg-cyan-500/20 hover:border-cyan-400/50 border border-white/20 transition-all group"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl text-gray-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
              </a>
              <a
                href="https://instagram.com/travel"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-full hover:bg-purple-500/20 hover:border-purple-400/50 border border-white/20 transition-all group"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl text-gray-400 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
              </a>
              <a
                href="https://facebook.com/travel"
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-full hover:bg-blue-500/20 hover:border-blue-400/50 border border-white/20 transition-all group"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl text-gray-400 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Voyago Travel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
