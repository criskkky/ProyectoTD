import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@/services/auth.service.js';
import { useState } from "react";
import { FaBars, FaBriefcase } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
  // const userRole = user?.rol;
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutSubmit = () => {
    try {
      logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    if (!menuOpen) {
      removeActiveClass();
    } else {
      addActiveClass();
    }
    setMenuOpen(!menuOpen);
  };

  const removeActiveClass = () => {
    const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
    activeLinks.forEach(link => link.classList.remove('active'));
  };

  const addActiveClass = () => {
    const links = document.querySelectorAll('.nav-menu ul li a');
    links.forEach(link => {
      if (link.getAttribute('href') === location.pathname) {
        link.classList.add('active');
      }
    });
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src="../public/icon-blue.png" alt="Logo" className="w-10 h-10 text-blue" />
          </div>
          <span className="text-xl font-bold text-gray-900">ProyectoTD</span>
        </div>
        {/* Menú central */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-600 hover:text-blue-600 transition-colors text-lg font-semibold ${isActive ? 'text-blue-600 font-bold' : ''}`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `text-gray-600 hover:text-blue-600 transition-colors text-lg font-semibold ${isActive ? 'text-blue-600 font-bold' : ''}`
            }
          >
            Explorar
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-gray-600 hover:text-blue-600 transition-colors text-lg font-semibold ${isActive ? 'text-blue-600 font-bold' : ''}`
            }
          >
            Dashboard
          </NavLink>
          {user && user.rol === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-gray-600 hover:text-red-600 transition-colors text-lg font-semibold ${isActive ? 'text-red-600 font-bold' : ''}`
              }
            >
              Admin
            </NavLink>
          )}
        </div>
        {/* Botón sesión y hamburguesa */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            {user ? (
              <button
                onClick={logoutSubmit}
                className="border border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent px-4 py-2 rounded-lg font-semibold"
              >
                Cerrar sesión
              </button>
            ) : (
              <NavLink
                to="/auth"
                className="border border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent px-4 py-2 rounded-lg font-semibold"
              >
                Iniciar sesión
              </NavLink>
            )}
          </div>
          <div className="md:hidden">
            <button
              className="hamburger p-2 rounded hover:bg-gray-200 transition-colors"
              onClick={toggleMenu}
              aria-label="Abrir menú"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </nav>
      {/* Menú móvil */}
      <div className={`nav-menu ${menuOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-white/90 z-50 md:hidden`}>
        <ul className="flex flex-col items-center py-4 space-y-2">
          <li>
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-blue-50 transition-colors text-lg font-semibold w-full text-center ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700'}`
              }
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/explore"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-blue-50 transition-colors text-lg font-semibold w-full text-center ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700'}`
              }
            >
              Explorar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-blue-50 transition-colors text-lg font-semibold w-full text-center ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700'}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          {user && user.rol === 'admin' && (
            <li>
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-red-50 transition-colors text-lg font-semibold w-full text-center ${isActive ? 'text-red-600 font-bold' : 'text-gray-700'}`
                }
              >
                Admin
              </NavLink>
            </li>
          )}
          <li>
            {user ? (
              <button
                onClick={() => {
                  logoutSubmit();
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 rounded border border-blue-200 text-blue-600 bg-transparent hover:bg-blue-50 font-semibold w-full text-center"
              >
                Cerrar sesión
              </button>
            ) : (
              <NavLink
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded border border-blue-200 text-blue-600 bg-transparent hover:bg-blue-50 font-semibold w-full text-center"
              >
                Iniciar sesión
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
