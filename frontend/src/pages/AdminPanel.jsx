import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaUserCircle, FaClipboardList } from "react-icons/fa";
import useUsers from "@/hooks/users/useGetUsers";
import useEditUser from "@/hooks/users/useEditUser";
import usePublications from "@/hooks/publications/usePublications";
import { startCase } from "lodash";
import PubliForm from "../components/PubliForm";
import UserForm from "../components/UserForm";
import useDeleteUser from "@/hooks/users/useDeleteUser";

const AdminPanel = () => {
  // Buscadores
  const [publiSearch, setPubliSearch] = useState("");
  const [publiSearchType, setPubliSearchType] = useState("titulo");
  const [publiEstado, setPubliEstado] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userSearchType, setUserSearchType] = useState("email");

  const [user, setUser] = useState({});
  const [showPubliForm, setShowPubliForm] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    publicaciones,
    loading: loadingPublicaciones,
    fetchPublicaciones,
    handleEditarPublicacion,
    handleEliminarPublicacion,
  } = usePublications();

  const {
    users,
    loading: loadingUsers,
    fetchUsers,
    setUsers,
  } = useUsers();

  const { handleUpdate: handleEditarUsuario, setDataUser } = useEditUser(setUsers);
  const { handleDelete } = useDeleteUser(fetchUsers);

  // Paginación publicaciones
  const [publiPage, setPubliPage] = useState(1);
  const PUBLICACIONES_PER_PAGE = 10;
  const totalPubliPages = Math.ceil((Array.isArray(publicaciones) ? publicaciones.length : 0) / PUBLICACIONES_PER_PAGE);
  const paginatedPublicaciones = Array.isArray(publicaciones) ? publicaciones.slice((publiPage - 1) * PUBLICACIONES_PER_PAGE, publiPage * PUBLICACIONES_PER_PAGE) : [];
  // Paginación usuarios
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 10;
  const totalUserPages = Math.ceil((Array.isArray(users) ? users.length : 0) / USERS_PER_PAGE);
  const paginatedUsers = Array.isArray(users) ? users.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE) : [];

  // Filtrado publicaciones
  const filteredPublicaciones = paginatedPublicaciones.filter((publi) => {
    let match = true;
    if (publiSearch) {
      if (publiSearchType === "id") match = String(publi.id).includes(publiSearch);
      else if (publiSearchType === "titulo") match = publi.titulo?.toLowerCase().includes(publiSearch.toLowerCase());
      else if (publiSearchType === "usuario") match = publi.createdBy?.email?.toLowerCase().includes(publiSearch.toLowerCase());
    }
    if (publiEstado) {
      match = match && publi.estado?.toLowerCase() === publiEstado;
    }
    return match;
  });
  // Filtrado usuarios
  const filteredUsers = paginatedUsers.filter((usuario) => {
    if (!userSearch) return true;
    if (userSearchType === "id") return String(usuario.id).includes(userSearch);
    if (userSearchType === "email") return usuario.email?.toLowerCase().includes(userSearch.toLowerCase());
    if (userSearchType === "nombre") return (`${usuario.nombres} ${usuario.apellidos}`).toLowerCase().includes(userSearch.toLowerCase());
    if (userSearchType === "rut") return usuario.rut?.toLowerCase().includes(userSearch.toLowerCase());
    return true;
  });

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario")) || {};
    setUser(usuario);
    if (usuario.rol === "admin") {
      fetchPublicaciones();
      fetchUsers();
    }
  }, [fetchPublicaciones, fetchUsers]);

  if (user.rol !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Acceso denegado</h2>
          <p className="text-gray-700">Esta página es solo para administradores.</p>
        </div>
      </div>
    );
  }

  const handleEditarPublicacionForm = (publication) => {
    setSelectedPublication(publication);
    setShowPubliForm(true);
  };

  const handleSubmitPubliForm = async (formData) => {
    if (selectedPublication) {
      await handleEditarPublicacion(selectedPublication.id, formData);
      await fetchPublicaciones();
    }
    setShowPubliForm(false);
  };

  const handleEditarUsuarioPopup = (usuario) => {
    setSelectedUser({
      ...usuario,
      rol: usuario.rol || "user" // Asegurar que rol siempre tenga un valor
    });
    setDataUser([usuario]); // Configurar dataUser para useEditUser
    setShowUserForm(true);
  };

  const handleSubmitUserForm = async (formData) => {
    if (selectedUser) {
      try {
        await handleEditarUsuario(formData);
        setShowUserForm(false);
        setSelectedUser(null);
        setDataUser([]); // Limpiar dataUser después de la edición
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-7xl mx-auto px-2 md:px-0 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gestión de publicaciones */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaClipboardList /> Todas las publicaciones
            </h2>
            {/* Buscador publicaciones */}
            <div className="flex gap-2 mb-4 flex-shrink-0">
              <select value={publiSearchType} onChange={e => setPubliSearchType(e.target.value)} className="border rounded px-2 py-1">
                <option value="id">ID</option>
                <option value="titulo">Título</option>
                <option value="usuario">Usuario</option>
              </select>
              <input
                type="text"
                value={publiSearch}
                onChange={e => setPubliSearch(e.target.value)}
                placeholder={`Buscar por ${publiSearchType}`}
                className="border rounded px-2 py-1 w-full"
              />
              <select value={publiEstado} onChange={e => setPubliEstado(e.target.value)} className="border rounded px-2 py-1">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>
            {loadingPublicaciones ? (
              <p>Cargando publicaciones...</p>
            ) : (
              <div className="flex flex-col flex-1">
                {/* Contenedor con altura fija para la tabla */}
                <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-sm md:text-base">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="border-b">
                        <th className="py-3 px-2 font-semibold text-gray-700">ID</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Título</th>
                        <th className="py-3 px-2 font-semibold text-gray-700 w-32 max-w-[8rem]">Usuario</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Estado</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Fecha</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPublicaciones.map((publi) => (
                        <tr key={publi.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 font-mono text-xs text-gray-700">{publi.id}</td>
                          <td className="py-3 px-2 font-medium text-gray-900">{publi.titulo}</td>
                          <td className="py-3 px-2 w-32 max-w-[8rem] truncate" title={publi.createdBy?.email}>{publi.createdBy?.email || "-"}</td>
                          <td className="py-3 px-2">{publi.estado}</td>
                          <td className="py-3 px-2 text-gray-600">{publi.createdAt}</td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800 font-semibold transition"
                                onClick={() => handleEditarPublicacionForm(publi)}
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 text-red-600 hover:text-red-800 font-semibold transition"
                                onClick={() => handleEliminarPublicacion(publi.id)}
                                title="Eliminar"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Controles de paginación */}
                <div className="flex justify-center items-center gap-2 mt-4 flex-shrink-0">
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setPubliPage((p) => Math.max(1, p - 1))}
                    disabled={publiPage === 1}
                  >Anterior</button>
                  <span className="mx-2 text-sm">Página {publiPage} de {totalPubliPages}</span>
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setPubliPage((p) => Math.min(totalPubliPages, p + 1))}
                    disabled={publiPage === totalPubliPages}
                  >Siguiente</button>
                </div>
              </div>
            )}
          </div>
          {/* Gestión de usuarios */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUserCircle /> Todos los usuarios
            </h2>
            {/* Buscador usuarios */}
            <div className="flex gap-2 mb-4 flex-shrink-0">
              <select value={userSearchType} onChange={e => setUserSearchType(e.target.value)} className="border rounded px-2 py-1">
                <option value="id">ID</option>
                <option value="email">Email</option>
                <option value="nombre">Nombre</option>
                <option value="rut">RUT</option>
              </select>
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder={`Buscar por ${userSearchType}`}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            {loadingUsers ? (
              <p>Cargando usuarios...</p>
            ) : (
              <div className="flex flex-col flex-1">
                {/* Contenedor con altura fija para la tabla */}
                <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-sm md:text-base">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="border-b">
                        <th className="py-3 px-2 font-semibold text-gray-700">ID</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Nombre</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Email</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Rol</th>
                        <th className="py-3 px-2 font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((usuario) => (
                        <tr key={usuario.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 font-mono text-xs text-gray-700">{usuario.id}</td>
                          <td className="py-3 px-2 font-medium text-gray-900">{startCase(usuario.nombres)} {startCase(usuario.apellidos)}</td>
                          <td className="py-3 px-2">{usuario.email}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${usuario.rol === "admin" ? "bg-red-100 text-red-700" : usuario.rol === "user" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-800"}`}>{startCase(usuario.rol)}</span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800 font-semibold transition"
                                onClick={() => handleEditarUsuarioPopup(usuario)}
                                title="Editar"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 text-red-600 hover:text-red-800 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDelete([usuario])}
                                title="Eliminar"
                                disabled={usuario.id === user.id}
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Controles de paginación */}
                <div className="flex justify-center items-center gap-2 mt-4 flex-shrink-0">
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                  >Anterior</button>
                  <span className="mx-2 text-sm">Página {userPage} de {totalUserPages}</span>
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                    disabled={userPage === totalUserPages}
                  >Siguiente</button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Popups */}
        {/* Modal para editar publicación */}
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
        {/* Modal para editar usuario */}
        {showUserForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => setShowUserForm(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">Editar usuario</h2>
              <UserForm
                initialData={selectedUser || {}}
                onSubmit={handleSubmitUserForm}
                buttonText="Actualizar"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;