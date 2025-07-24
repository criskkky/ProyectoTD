import React, { useEffect, useState } from "react";
import { FaUserCircle, FaClipboardList, FaPlusCircle, FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";
import ProfilePopup from "../components/ProfilePopup";
import PubliPopup from "../components/PubliPopup"; // Importamos el componente PubliPopup
import useEditProfile from "../hooks/profile/useEditProfile";
import usePublications from "../hooks/publications/usePublications";
import { startCase } from 'lodash';
import { formatUserData } from '../helpers/formatData';

const Dashboard = () => {
  const {
    showPopup,
    setShowPopup,
    user,
    setUser,
    openEditProfile,
    handleEditProfile,
  } = useEditProfile();

  const {
    publicaciones,
    loading,
    fetchPublicaciones,
    handleEditarPublicacion,
    handleEliminarPublicacion,
    handleCrearPublicacion,
  } = usePublications();

  // Solo mostrar publicaciones creadas por el usuario actual
  const publicacionesPropias = publicaciones.filter(
    (publi) => publi.createdBy?.id === user.id
  );

  const [showPubliPopup, setShowPubliPopup] = useState(false); // Estado para controlar el PubliPopup
  const [selectedPublication, setSelectedPublication] = useState(null); // Publicación seleccionada para editar

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario')) || {};
    setUser(usuario);

    if (usuario.id) {
      fetchPublicaciones(usuario.id);
    }
  }, [setUser]);

  const maxPublicaciones = user.rol === "premium" ? 6 : 3;
  const solicitudesRecibidas = 5;

  // Formatear fecha de creación
  function formatFecha(fecha) {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CL", { year: "numeric", month: "long" });
  }

  // Formatear datos de usuario para vista
  const perfil = formatUserData(user);

  const openCrearPublicacionPopup = () => {
    setSelectedPublication(null); // Reseteamos la publicación seleccionada
    setShowPubliPopup(true); // Mostramos el PubliPopup para crear una nueva publicación
  };

  const handleEditarPublicacionPopup = (publication) => {
    setSelectedPublication(publication);
    setShowPubliPopup(true);
  };

  const handleSubmitPubliPopup = (formData) => {
    if (selectedPublication) {
      handleEditarPublicacion(selectedPublication.id, formData);
    } else {
      handleCrearPublicacion(formData); // Crear nueva publicación
    }
    setShowPubliPopup(false);
  };

  const handleEditarPerfil = () => {
    openEditProfile(user); // Pasa el usuario actual aquí
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-6xl mx-auto px-2 md:px-0 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido de vuelta!</h1>
          <p className="text-gray-600">Gestiona tus publicaciones y revisa tus solicitudes desde aquí.</p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Publicaciones realizadas</p>
                <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{publicacionesPropias.length}</span>
          <span className="text-sm text-gray-500">/{maxPublicaciones}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(publicacionesPropias.length / maxPublicaciones) * 100}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round((publicacionesPropias.length / maxPublicaciones) * 100)}% del límite utilizado</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Solicitudes recibidas</p>
                <span className="text-3xl font-bold text-gray-900">{solicitudesRecibidas}</span>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaEnvelope className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span className="mr-1">+2 esta semana</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Vistas del perfil</p>
                <span className="text-3xl font-bold text-gray-900">24</span>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUserCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <span className="mr-1">Últimas 24h</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Calificación promedio</p>
                <div className="flex items-center space-x-1">
                  <span className="text-3xl font-bold text-gray-900">4.8</span>
                  <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Publicaciones */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md">
              <div className="pb-4 px-6 pt-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Mis publicaciones</h2>
                <button
                  onClick={openCrearPublicacionPopup}
                  disabled={publicaciones.length >= maxPublicaciones}
                  className={`flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm md:text-base ${
                    publicaciones.length >= maxPublicaciones ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  <FaPlusCircle className="mr-1" /> Crear publicación
                </button>
              </div>
              <div className="px-6 pb-6">
                {loading ? (
                  <p>Cargando publicaciones...</p>
                ) : publicacionesPropias.length === 0 ? (
                  <div className="text-center py-8 border-t border-gray-100 mt-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaClipboardList className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">¿Listo para crear más publicaciones?</p>
                    <button
                      onClick={openCrearPublicacionPopup}
                      className="flex items-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent font-semibold py-2 px-4 rounded"
                    >
                      <FaPlusCircle className="mr-1" /> Crear nueva publicación
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm md:text-base border-separate border-spacing-y-2">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="py-3 px-2 font-semibold text-gray-700">Título</th>
                          <th className="py-3 px-2 font-semibold text-gray-700">Categoría</th>
                          <th className="py-3 px-2 font-semibold text-gray-700">Modalidad</th>
                          <th className="py-3 px-2 font-semibold text-gray-700">Estado</th>
                          <th className="py-3 px-2 font-semibold text-gray-700">Fecha</th>
                          <th className="py-3 px-2 font-semibold text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {publicacionesPropias.map((servicio) => (
                          <tr key={servicio.id} className="border rounded-xl shadow hover:shadow-lg transition bg-white">
                            <td className="py-3 px-2 font-medium text-gray-900">{servicio.titulo}</td>
                            <td className="py-3 px-2">
                              <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{servicio.categoria}</span>
                            </td>
                            <td className="py-3 px-2">
                              <span className="inline-block border border-green-200 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">{servicio.modalidad}</span>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${servicio.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-800"}`}>{servicio.estado}</span>
                            </td>
                            <td className="py-3 px-2 text-gray-600">{servicio.createdAt}</td>
                            <td className="py-3 px-2 flex gap-2">
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800 font-semibold transition"
                                onClick={() => handleEditarPublicacionPopup(servicio)}
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 text-red-600 hover:text-red-800 font-semibold transition"
                                onClick={() => handleEliminarPublicacion(servicio.id)}
                                title="Eliminar"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Perfil y acciones rápidas */}
          <div className="space-y-6">
            {/* Perfil */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="pb-4 px-6 pt-6">
                <h2 className="text-xl font-semibold text-gray-900">Mi perfil</h2>
              </div>
              <div className="px-6 pb-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-semibold">
                    <FaUserCircle />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{startCase(perfil.nombre)} {startCase(perfil.apellidos)}</h3>
                    <p className="text-sm text-gray-600">{perfil.email}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${user.rol === "admin" ? "bg-red-100 text-red-700" : user.rol === "user" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-800"}`}>{startCase(user.rol) || "Error"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ID de usuario:</span>
                    <span className="font-medium text-gray-900">{perfil.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Miembro desde:</span>
                    <span className="font-medium text-gray-900">{perfil.createdAt}</span>
                  </div>
                </div>
                <button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded flex items-center justify-center"
                  onClick={handleEditarPerfil}
                >
                  <FaEdit className="w-4 h-4 mr-2" /> Editar perfil
                </button>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="pb-4 px-6 pt-6">
                <h2 className="text-lg font-semibold text-gray-900">Acciones rápidas</h2>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button className="w-full justify-start bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2" /> Ver solicitudes ({solicitudesRecibidas})
                </button>
                <button className="w-full justify-start bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded flex items-center">
                  <FaClipboardList className="w-4 h-4 mr-2" /> Programar cita
                </button>
                <button className="w-full justify-start bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded flex items-center">
                  <FaUserCircle className="w-4 h-4 mr-2" /> Ver mi perfil público
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popups */}
        <ProfilePopup
          show={showPopup}
          setShow={setShowPopup}
          data={[user]}
          action={handleEditProfile}
        />
        <PubliPopup
          show={showPubliPopup}
          setShow={setShowPubliPopup}
          data={[selectedPublication]}
          action={handleSubmitPubliPopup}
        />
      </div>
    </div>
  );
};

export default Dashboard;
