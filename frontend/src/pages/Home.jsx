import { FaQuestionCircle, FaSignInAlt, FaUserTie, FaSearch, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Home */}
      <div className="home flex flex-col xl:flex-row md:justify-center md:items-start mt-10 gap-8 px-4">
        {/* Columna izquierda: Bienvenida y descripción */}
        <div className="md:w-1/2 max-w-2xl mx-auto md:mx-0 py-6 px-2 md:px-0">
          <h1 className="text-4xl font-bold text-left text-gray-900">¡Bienvenid@!</h1>
          <h3 className="text-xl font-semibold text-left mt-4 text-blue-600">
            ¡Nos alegra tenerte por aquí!
          </h3>
          <p className="text-left mt-1 text-lg text-gray-700">
            Te presentamos <b>ProyectoTD</b>, la plataforma de autopromoción laboral que conecta a personas en Chile con trabajadores de distintas áreas, ya sea de forma presencial, online o mixta.
          </p>
          <h3 className="text-xl font-semibold text-left mt-1 text-blue-600">
            ¿Qué encontrarás en nuestra plataforma?
          </h3>
          <p className="text-left mt-1 text-lg text-gray-700">
            Ofrecemos una interfaz intuitiva y amigable que te permitirá navegar fácilmente por los servicios publicados por nuestros usuarios. Desde profesionales de la salud, educación, tecnología y mucho más.
          </p>
        </div>
        {/* Columna derecha: ¿Cómo empezar? */}
        <div className="md:w-[50rem] max-w-lg mx-auto md:mx-0 px-2 md:px-0">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <FaQuestionCircle className="inline-block text-blue-500" size={24} />
              ¿Cómo empezar?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">
                  <FaSignInAlt size={20} />
                </span>
                <span>
                  <b>Regístrate o inicia sesión</b> para acceder a todas las funcionalidades de la plataforma.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">
                  <FaUserTie size={20} />
                </span>
                <span>
                  <b>Publica tu servicio</b>: Completa tu perfil y crea una oferta detallando tu especialidad, modalidad (presencial, online, mixta) y disponibilidad.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">
                  <FaSearch size={20} />
                </span>
                <span>
                  <b>Explora servicios</b>: Usa los filtros por categoría, modalidad y otros para encontrar lo que necesitas.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">
                  <FaClipboardList size={20} />
                </span>
                <span>
                  <b>Gestiona tus contrataciones</b>: Desde el Dashboard puedes ver tus servicios publicados, solicitudes y mensajes.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Linea horizontal */}
      <hr className="mx-4 md:mx-80 my-10 border-t border-gray-300" />
      {/* Sección */}
      <div className="text-center px-4 md:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué estas esperando?</h2>
        <p className="text-lg text-gray-700 mb-6">
          Crea tu cuenta y súmate a la nueva forma de encontrar trabajo en Chile. 
        </p>
        <button 
          onClick={() => {
            const usuario = sessionStorage.getItem('usuario');
            if (usuario) {
              navigate('/dashboard');
            } else {
              navigate('/register');
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Regístrate ahora
        </button>
      </div>
    </>
  );
}

export default Home;
