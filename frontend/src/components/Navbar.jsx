import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
  const userRole = user?.rol;
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
    <nav className="navbar bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <div className={`nav-menu ${menuOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-white z-10 md:static md:block md:w-auto md:bg-transparent`}>
        <ul className="flex flex-col md:flex-row md:space-x-6">
          <li>
            <NavLink
              to="/home"
              onClick={() => {
                setMenuOpen(false);
                addActiveClass();
              }}
              className={() =>
                `block px-4 py-2 rounded hover:bg-gray-100 transition-colors ${
                  (location.pathname === "/home" || location.pathname === "/")
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-700'
                }`
              }
            >
              Inicio
            </NavLink>
          </li>
          {userRole === 'admin' && (
            <>
              <li>
                <NavLink
                  to="/users"
                  onClick={() => {
                    setMenuOpen(false);
                    addActiveClass();
                  }}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700'}`
                  }
                >
                  Usuarios
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              to="/auth"
              onClick={() => {
                logoutSubmit();
                setMenuOpen(false);
              }}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700'}`
              }
            >
              Cerrar sesión
            </NavLink>
          </li>
        </ul>
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
    </nav>
  );
};

export default Navbar;
