import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import usePublications from "../hooks/publications/usePublications";
import { fetchCiudades } from "../services/city.service";

function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const { publicaciones, loading, fetchPublicaciones } = usePublications();

  // Leer parámetros de la URL al cargar
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get("search") || "",
      categoria: params.get("categoria") || "",
      modalidad: params.get("modalidad") || "",
      ciudad: params.get("ciudad") || ""
    };
  };

  const [search, setSearch] = useState(getQueryParams().search);
  const [categoria, setCategoria] = useState(getQueryParams().categoria);
  const [modalidad, setModalidad] = useState(getQueryParams().modalidad);
  const [ciudad, setCiudad] = useState("");
  const [pendingSearch, setPendingSearch] = useState({
    search: getQueryParams().search,
    categoria: getQueryParams().categoria,
    modalidad: getQueryParams().modalidad,
    ciudad: ""
  });
  const [ciudadesTodas, setCiudadesTodas] = useState([]);
  const [ciudadSugerencias, setCiudadSugerencias] = useState([]);

  // Actualizar los inputs sin disparar búsqueda
  const handleInputChange = (e) => {
    setPendingSearch({ ...pendingSearch, search: e.target.value });
  };
  const handleCategoriaChange = (e) => {
    setPendingSearch({ ...pendingSearch, categoria: e.target.value });
  };
  const handleModalidadChange = (e) => {
    setPendingSearch({ ...pendingSearch, modalidad: e.target.value });
  };
  const handleCiudadChange = (e) => {
    const value = e.target.value;
    setPendingSearch({ ...pendingSearch, ciudad: value });
    if (value.length > 1 && ciudadesTodas.length > 0) {
      const sugerencias = ciudadesTodas.filter(c => c.toLowerCase().includes(value.toLowerCase()));
      setCiudadSugerencias(sugerencias);
    } else {
      setCiudadSugerencias([]);
    }
  };
  const handleCiudadSelect = (ciudadSeleccionada) => {
    setPendingSearch({ ...pendingSearch, ciudad: ciudadSeleccionada });
    setCiudadSugerencias([]);
  };
  const handleCiudadBlur = () => {
    const value = pendingSearch.ciudad;
    if (value.length > 1 && ciudadSugerencias.length > 0) {
      setPendingSearch({ ...pendingSearch, ciudad: ciudadSugerencias[0] });
      setCiudadSugerencias([]);
    }
  };

  // Buscar y actualizar estados/URL solo al enviar el formulario
  const handleBuscar = (e) => {
    e.preventDefault();
    setSearch(pendingSearch.search);
    setCategoria(pendingSearch.categoria);
    setModalidad(pendingSearch.modalidad);
    setCiudad(pendingSearch.ciudad);
    const params = new URLSearchParams();
    if (pendingSearch.search) params.set("search", pendingSearch.search);
    if (pendingSearch.categoria) params.set("categoria", pendingSearch.categoria);
    if (pendingSearch.modalidad) params.set("modalidad", pendingSearch.modalidad);
    if (pendingSearch.ciudad) params.set("ciudad", pendingSearch.ciudad);
    navigate({ search: params.toString() }, { replace: true });
  };

  // Disparar búsqueda solo cuando cambian los estados principales
  useEffect(() => {
    fetchPublicaciones({ search, categoria, modalidad, ciudad });
    // eslint-disable-next-line
  }, [search, categoria, modalidad, ciudad]);

  // Obtener todas las ciudades al montar la página
  useEffect(() => {
    async function cargarCiudades() {
      const todas = await fetchCiudades("");
      console.log("[FRONT] Ciudades recibidas:", todas);
      setCiudadesTodas(todas);
    }
    cargarCiudades();
  }, []);

  // Categorías y modalidades posibles
  const categorias = [
    "arte",
    "construcción",
    "educacion",
    "idiomas",
    "salud",
    "servicios generales",
    "tecnología"
  ];
  const modalidades = ["presencial", "online", "mixta"];

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero título */}
          <section className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold mb-4">
              <FaSearch className="text-blue-500" size={20} />
              Explora servicios
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Encuentra el servicio que necesitas</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Navega por cientos de publicaciones y conecta con trabajadores de distintas áreas en Chile.
            </p>
          </section>

          {/* Search Bar mejorada */}
          <section className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <form className="flex flex-col sm:flex-row items-center gap-4" onSubmit={handleBuscar}>
              <input
                type="text"
                value={pendingSearch.search}
                onChange={handleInputChange}
                placeholder="Buscar por palabra clave, título o descripción..."
                className="flex-[2] min-w-0 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <div className="relative w-full sm:w-auto flex-1 min-w-[160px] max-w-xs">
                <input
                  type="text"
                  value={pendingSearch.ciudad}
                  onChange={handleCiudadChange}
                  onBlur={handleCiudadBlur}
                  placeholder="Ciudad..."
                  className="p-3 border border-blue-200 rounded-lg text-lg bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                {ciudadSugerencias.length > 0 && (
                  <ul className="absolute z-10 left-0 right-0 bg-white border border-blue-200 rounded-lg mt-1 shadow-lg max-h-40 overflow-y-auto">
                    {ciudadSugerencias.map((c) => (
                      <li
                        key={c}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                        onClick={() => handleCiudadSelect(c)}
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative w-full sm:w-auto flex-1 min-w-[160px] max-w-xs">
                <select
                  value={pendingSearch.categoria}
                  onChange={handleCategoriaChange}
                  className="appearance-none p-3 pr-10 border border-blue-200 rounded-lg text-lg bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={18} />
              </div>
              <div className="relative w-full sm:w-auto flex-1 min-w-[160px] max-w-xs">
                <select
                  value={pendingSearch.modalidad}
                  onChange={handleModalidadChange}
                  className="appearance-none p-3 pr-10 border border-blue-200 rounded-lg text-lg bg-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las modalidades</option>
                  {modalidades.map(mod => (
                    <option key={mod} value={mod}>{mod.charAt(0).toUpperCase() + mod.slice(1)}</option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={18} />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all"
              >
                Buscar
              </button>
            </form>
          </section>

          {/* Mostrar servicios obtenidos del backend */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Publicaciones Disponibles</h2>
            {loading ? (
              <div className="text-center py-10 text-blue-600 font-semibold text-xl">Cargando publicaciones...</div>
            ) : (publicaciones.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">No hay publicaciones disponibles en este momento.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicaciones.map((servicio) => (
                  <Link
                    key={servicio.id}
                    to={`/servicio/${servicio.id}`}
                    className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 block hover:shadow-xl hover:border-blue-500 transition-all"
                  >
                    <h3 className="font-bold text-2xl mb-2 text-blue-700 truncate">{servicio.titulo}</h3>
                    <p className="text-gray-600 text-base mb-2">
                      <span className="font-semibold">{servicio.categoria}</span> • {servicio.modalidad}
                    </p>
                    <p className="text-gray-700 mb-2 line-clamp-3">{servicio.descripcion}</p>
                    <p className="text-gray-500 text-xs mt-4">{servicio.createdAt}</p>
                  </Link>
                ))}
              </div>
            ))}
          </section>
        </div>
      </div>
  );
}

export default Explore;
