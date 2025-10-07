'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import logoImage from '../images/apart.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Close mobile menu after logout
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center flex-col justify-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src={logoImage} 
                  alt="Logo" 
                  width={50} 
                  height={50} 
                  className="rounded-full" // Changed to rounded-full for circular image
                />
              </Link>
            </div>
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:border-indigo-300 hover:text-indigo-500'
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/ropa"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/ropa'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:border-indigo-300 hover:text-indigo-500'
                }`}
              >
                Ropa
              </Link>
            </div>
          </div>
          
          {/* Desktop auth buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/admin')
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-500'
                  }`}
                >
                  Consola de Administracion
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-500"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200"
              >
                Iniciar Sesion
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/ropa"
              onClick={closeMenu}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/ropa'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              Ropa
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="space-y-1">
              {user ? (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname.startsWith('/admin')
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500'
                    }`}
                  >
                    Consola de Administracion
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={closeMenu}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500"
                >
                  Iniciar Sesion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
