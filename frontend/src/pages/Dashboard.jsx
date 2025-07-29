import React, { useEffect, useState } from "react";
import { FaUserCircle, FaClipboardList, FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";
import ProfilePopup from "../components/ProfilePopup";
import PubliForm from "../components/PubliForm";
import useEditProfile from "../hooks/profile/useEditProfile";
import usePublications from "../hooks/publications/usePublications";
import { startCase } from 'lodash';
import { formatUserData, getFirstNameLastName } from '../helpers/formatData';

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

  const publicacionesPropias = publicaciones.filter(
    (publi) => publi.createdBy?.id === user.id
  );

  const [showPubliForm, setShowPubliForm] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario')) || {};
    setUser(usuario);

    if (usuario.id) {
      fetchPublicaciones(usuario.id);
    }
  }, [setUser, fetchPublicaciones]); // Dependencias actualizadas para evitar bucles infinitos

  const rolLimits = {
    user: 2,
    premium: 4,
    premium2: 6,
    admin: 6,
  };
  const maxPublicaciones = rolLimits[user.rol] || 2;

  const perfil = formatUserData(user);

  const openCrearPublicacionPopup = () => {
    setSelectedPublication(null);
    setShowPubliForm(true);
  };

  const handleEditarPublicacionForm = (publication) => {
    setSelectedPublication(publication);
    setShowPubliForm(true);
  };

  const handleSubmitPubliForm = (formData) => {
    if (selectedPublication) {
      handleEditarPublicacion(selectedPublication.id, formData);
    } else {
      handleCrearPublicacion(formData);
    }
    setShowPubliForm(false);
  };

  const handleEditarPerfil = () => {
    openEditProfile(user);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-6xl mx-auto px-2 md:px-0 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido de vuelta!</h1>
          <p className="text-gray-600">Gestiona tus publicaciones y revisa tus solicitudes desde aquí.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Publicaciones realizadas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md">
              <div className="pb-4 px-6 pt-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Publicaciones realizadas</h2>
                <button
                  onClick={openCrearPublicacionPopup}
                  disabled={publicacionesPropias.length >= maxPublicaciones}
                  className={`flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm md:text-base ${
                    publicacionesPropias.length >= maxPublicaciones ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  <FaPlusCircle className="mr-1" /> Crear publicación
                </button>
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{publicacionesPropias.length}</span>
                  <span className="text-sm text-gray-500">/{maxPublicaciones}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(publicacionesPropias.length / maxPublicaciones) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  {Math.round((publicacionesPropias.length / maxPublicaciones) * 100)}% del límite utilizado
                </p>
                {loading ? (
                  <p>Cargando publicaciones...</p>
                ) : publicacionesPropias.length === 0 ? (
                  <div className="text-center py-8 border-t border-gray-100 mt-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaClipboardList className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">¿Listo para crear publicaciones?</p>
                    <button
                      onClick={openCrearPublicacionPopup}
                      className="flex items-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent font-semibold py-2 px-4 rounded mx-auto"
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
                                onClick={() => handleEditarPublicacionForm(servicio)}
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
                    <h3 className="font-semibold text-gray-900">{getFirstNameLastName(perfil)}</h3>
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
        {/* Modal para crear/editar publicación */}
        {showPubliForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => setShowPubliForm(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedPublication ? "Editar publicación" : "Crear publicación"}</h2>
              <PubliForm
                initialData={selectedPublication || {}}
                onSubmit={handleSubmitPubliForm}
                buttonText={selectedPublication ? "Actualizar" : "Crear"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
