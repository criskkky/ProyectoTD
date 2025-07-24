import { FaBriefcase, FaUserPlus, FaSearch, FaCog, FaArrowRight, FaCheckCircle, FaUsers } from "react-icons/fa";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                <FaUsers className="text-blue-500" size={20} />
                ¡Bienvenid@!
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Conecta con los <span className="text-blue-600">trabajadores</span> de Chile
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                La plataforma de autopromoción laboral que conecta personas en Chile con trabajadores de distintas áreas, ya sea de forma presencial, online o mixta.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center gap-2" onClick={() => navigate('/register')}>
                Regístrate ahora <FaArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent px-8 py-3 rounded-lg text-lg font-semibold" onClick={() => navigate('/explore')}>
                Explorar servicios
              </button>
            </div>
          </div>

          {/* Getting Started Card */}
          <div className="lg:pl-8">
            <div className="bg-white shadow-xl rounded-xl p-8">
              <div className="flex items-center space-x-2 mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">¿Cómo empezar?</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Regístrate o inicia sesión</h4>
                    <p className="text-gray-600 text-sm">Para acceder a todas las funcionalidades de la plataforma.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaBriefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Publica tu servicio</h4>
                    <p className="text-gray-600 text-sm">Completa tu perfil y crea una oferta detallando tu especialidad y modalidad.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaSearch className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Explora servicios</h4>
                    <p className="text-gray-600 text-sm">Usa los filtros por categoría, modalidad y otros para encontrar lo que necesitas.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCog className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Gestiona tus contrataciones</h4>
                    <p className="text-gray-600 text-sm">Desde el Dashboard puedes ver tus servicios publicados, solicitudes y mensajes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Qué encontrarás en nuestra plataforma?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una interfaz intuitiva y amigable que te permitirá navegar fácilmente por los servicios publicados por nuestros usuarios.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Profesionales de la Salud</h3>
              <p className="text-gray-600">Encuentra médicos, enfermeros, terapeutas y otros profesionales de la salud.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Educación</h3>
              <p className="text-gray-600">Profesores, tutores y especialistas en educación para todos los niveles.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCog className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tecnología</h3>
              <p className="text-gray-600">Desarrolladores, diseñadores y expertos en tecnología y mucho más.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">¿Qué estás esperando?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Crea tu cuenta y súmate a la nueva forma de encontrar trabajo en Chile.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg rounded-lg font-semibold flex items-center gap-2 mx-auto" onClick={() => navigate('/register')}>
            Regístrate ahora <FaArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
