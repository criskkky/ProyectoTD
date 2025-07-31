import { FaBriefcase, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-1 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="/icon-blue.png" alt="Logo" className="w-10 h-10" />
              </div>
              <span className="text-xl font-bold">ProyectoTD</span>
            </div>
            <p className="text-gray-400">Conectando profesionales en Chile desde 2025.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition-colors" onClick={() => navigate('/explore')}>Explorar</button></li>
              <li><button className="hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>Dashboard</button></li>
              <li><button className="hover:text-white transition-colors" onClick={() => navigate('/help')}>Ayuda</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition-colors" onClick={() => navigate('/explore?cat=salud')}>Salud</button></li>
              <li><button className="hover:text-white transition-colors" onClick={() => navigate('/explore?cat=educacion')}>Educación</button></li>
              <li><button className="hover:text-white transition-colors" onClick={() => navigate('/explore?cat=tecnologia')}>Tecnología</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2"><FaMapMarkerAlt className="w-4 h-4" /><span>Chile</span></li>
              <li className="flex items-center space-x-2"><FaClock className="w-4 h-4" /><span>24/7 Disponible</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ProyectoTD. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
