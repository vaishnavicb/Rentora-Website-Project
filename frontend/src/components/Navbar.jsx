import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiLogOut, FiMenu, FiX, FiPackage, FiShoppingCart, FiBarChart, FiSettings, FiHeart, FiCreditCard } from 'react-icons/fi';
void motion;
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { href: '/', icon: FiHome, label: 'Home', public: true },
    { href: '/admin', icon: FiBarChart, label: 'Dashboard', role: 'admin' },
    { href: '/wallet', icon: FiCreditCard, label: 'Wallet', authenticated: true },
    { href: '/my-orders', icon: FiShoppingCart, label: 'My Orders', role: 'customer' },
    { href: '/my-products', icon: FiPackage, label: 'My Products', role: 'vendor' },
    { href: '/vendor-orders', icon: FiPackage, label: 'Orders', role: 'vendor' },
    { href: '/wishlist', icon: FiHeart, label: 'Wishlist', public: true }
  ];

  const visibleLinks = links.filter((link) => {
    if (user?.role === 'admin' && link.href === '/wishlist') {
      return false;
    }
    if (user?.role === 'admin' && link.href === '/wallet') {
      return false;
    }
    if (link.href === '/wishlist' && user?.role === 'vendor') {
      return false;
    }
    return link.public || (user && (link.authenticated || user.role === link.role));
  });

  const adminLoginLink = !user
    ? { href: '/admin-login', icon: FiSettings, label: 'Admin Login', public: true, iconOnly: true }
    : null;

  const AdminIcon = adminLoginLink?.icon;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="group bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer"
          >
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-100">
              Rentora
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.href} whileHover={{ scale: 1.05 }}>
                  <Link
                    to={link.href}
                    className={`text-white hover:bg-white/20 rounded-lg flex items-center gap-2 transition ${
                      link.iconOnly ? 'px-2 py-2' : 'px-3 py-2'
                    }`}
                    title={link.iconOnly ? link.label : link.label}
                    aria-label={link.iconOnly ? link.label : link.label}
                  >
                    <Icon size={18} />
                    {!link.iconOnly && link.label}
                  </Link>
                </motion.div>
              );
            })}
            {adminLoginLink && AdminIcon && (
              <motion.div whileHover={{ scale: 1.05 }} className="opacity-20 group-hover:opacity-100 transition duration-200">
                <Link
                  to={adminLoginLink.href}
                  className="text-white/70 hover:text-white hover:bg-white/20 px-2 py-2 rounded-lg flex items-center justify-center transition"
                  title={adminLoginLink.label}
                  aria-label={adminLoginLink.label}
                >
                  <AdminIcon size={18} />
                </Link>
              </motion.div>
            )}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-white font-semibold">
                  {user.name} ({user.role})
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
                >
                  <FiLogOut size={18} /> Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-blue-700 pb-4"
          >
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-600 px-4 py-2 flex items-center gap-2 transition block rounded"
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}

            {user ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-white hover:bg-blue-600 px-4 py-2 flex items-center gap-2 transition rounded mt-2"
              >
                <FiLogOut size={18} /> Logout
              </motion.button>
            ) : (
              <>
                <div className="flex gap-2 px-4 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center text-white hover:bg-blue-600 px-3 py-2 rounded transition font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center bg-white text-blue-600 hover:bg-gray-100 px-3 py-2 rounded transition font-semibold"
                  >
                    Register
                  </Link>
                </div>
                {adminLoginLink && (
                  <Link
                    to={adminLoginLink.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/70 hover:text-white hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 transition mt-2 mx-4"
                  >
                    <FiSettings size={18} />
                    {adminLoginLink.label}
                  </Link>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
