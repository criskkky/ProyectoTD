import React, { useEffect } from "react";
import { FaUserCircle, FaClipboardList, FaPlusCircle, FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import useEditProfile from "../hooks/profile/useEditProfile";
import { startCase } from 'lodash';

const servicios = [
  { id: 1, titulo: "Clases de Matemáticas", estado: "activo", createdAt: "04-06-2025", categoria: "educación", modalidad: "mixto" },
  { id: 2, titulo: "Soporte Técnico PC", estado: "inactivo", createdAt: "01-05-2025", categoria: "tecnología", modalidad: "presencial" },
  { id: 3, titulo: "Traducción Inglés-Español", estado: "bloqueado", createdAt: "15-04-2025", categoria: "idiomas", modalidad: "online" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    showPopup,
    setShowPopup,
    user,
    setUser,
    openEditProfile,
    handleEditProfile,
  } = useEditProfile();

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario')) || {};
    setUser(usuario);
  }, [setUser]);

  const publicaciones = servicios.length;
  const maxPublicaciones = user.rol === "premium" ? 6 : 3;
  const solicitudesRecibidas = 5;

  const perfil = {
    id: user.id || "Error",
    nombre: user.nombres || "Error",
    apellidos: user.apellidos || "Error",
    email: user.email || "Error"
  };

  // Debug de user all data
  console.log("User data:", user);

  // Handlers simulados
  const handleEditarServicio = (id) => {
    alert(`Editar servicio ${id}`);
  };
  const handleEliminarServicio = (id) => {
    alert(`Eliminar servicio ${id}`);
  };
  const handleEditarPerfil = () => {
    openEditProfile(user);
  };

  return (
    <main className="min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Panel de estadísticas */}
        <section className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex items-center gap-4">
            <FaClipboardList size={36} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">Publicaciones realizadas</h2>
              <p className="text-2xl font-bold">{publicaciones}/{maxPublicaciones}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <FaEnvelope size={36} className="text-green-600" />
            <div>
              <h2 className="text-lg font-semibold">Solicitudes recibidas</h2>
              <p className="text-2xl font-bold">{solicitudesRecibidas}</p>
            </div>
          </div>
        </section>

        {/* Gestión de publicaciones */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Mis publicaciones</h2>
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm md:text-base"
              onClick={() => navigate("/publicar-servicio")}
            >
              <FaPlusCircle /> Crear publicación
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm md:text-base">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2">Título</th>
                  <th className="py-2 px-2 hidden sm:table-cell">Categoría</th>
                  <th className="py-2 px-2 hidden sm:table-cell">Modalidad</th>
                  <th className="py-2 px-2">Estado</th>
                  <th className="py-2 px-2 hidden md:table-cell">Fecha de publicación</th>
                  <th className="py-2 px-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((servicio) => (
                  <tr key={servicio.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{servicio.titulo}</td>
                    <td className="py-2 px-2 hidden sm:table-cell">{servicio.categoria}</td>
                    <td className="py-2 px-2 hidden sm:table-cell">{servicio.modalidad}</td>
                    <td className="py-2 px-2">{servicio.estado}</td>
                    <td className="py-2 px-2 hidden md:table-cell">{servicio.createdAt}</td>
                    <td className="py-2 px-2 flex gap-2">
                      <button
                        className="text-blue-600 hover:underline flex items-center gap-1"
                        onClick={() => handleEditarServicio(servicio.id)}
                      >
                        <FaEdit />
                        <span className="hidden md:inline">Editar</span>
                      </button>
                      <button
                        className="text-red-600 hover:underline flex items-center gap-1"
                        onClick={() => handleEliminarServicio(servicio.id)}
                      >
                        <FaTrash />
                        <span className="hidden md:inline">Eliminar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edición rápida de perfil */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
            {/* Columna 1: Foto */}
            <FaUserCircle size={50} className="text-blue-500" />

            {/* Columna 2: ID, Nombre y Apellidos */}
            <div className="flex-1 w-full">
              <p className="font-semibold">
                ID: <span className="font-normal">{perfil.id}</span>
              </p>
              <p className="font-semibold">
                Nombre: <span className="font-normal">{startCase(perfil.nombre)} {startCase(perfil.apellidos)}</span>
              </p>
            </div>
            {/* Columna 3: Rol y Correo */}
            <div className="flex-1 w-full">
              <p className="font-semibold flex items-center gap-2">
                Rol:
                <span
                  className={`font-normal px-2 rounded 
                    ${user.rol === "admin" ? "bg-red-600 text-white" : 
                      user.rol === "user" ? "bg-blue-600 text-white" : 
                      "bg-gray-200 text-gray-800"}`}
                >
                  {startCase(user.rol) || "Error"}
                </span>
              </p>
              <p className="font-semibold">
                Correo: <span className="font-normal">{perfil.email}</span>
              </p>
            </div>
            {/* Columna 4: Botón Editar */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                onClick={handleEditarPerfil}
              >
                <FaEdit className="inline mr-2" /> Editar perfil
              </button>
            </div>
          </div>
        </section>
        {/* Popup para editar perfil */}
        <Popup
          show={showPopup}
          setShow={setShowPopup}
          data={[user]}
          action={handleEditProfile}
        />
      </div>
    </main>
  );
};

export default Dashboard;
