import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import usePublications from "../hooks/publications/usePublications";
import { fetchCities } from "../services/city.service";

function Explore() {
  const publicacionesRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { publicaciones, loading, fetchPublicaciones } = usePublications();

  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get("search") || "",
      categoria: params.get("categoria") || "",
      modalidad: params.get("modalidad") || "",
      city: params.get("city") || "",
      page: parseInt(params.get("page") || "1", 10)
    };
  }, [location.search]);

  const queryParams = getQueryParams();

  const [search, setSearch] = useState(queryParams.search);
  const [categoria, setCategoria] = useState(queryParams.categoria);
  const [modalidad, setModalidad] = useState(queryParams.modalidad);
  const [city, setCity] = useState(queryParams.city);
  const [paginaActual, setPaginaActual] = useState(queryParams.page);

  const [pendingSearch, setPendingSearch] = useState({
    search: queryParams.search,
    categoria: queryParams.categoria,
    modalidad: queryParams.modalidad,
    city: queryParams.city
  });

  const [citiesAll, setCitiesAll] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  useEffect(() => {
    const params = getQueryParams();
    setPendingSearch({
      search: params.search,
      categoria: params.categoria,
      modalidad: params.modalidad,
      city: params.city
    });
    setSearch(params.search);
    setCategoria(params.categoria);
    setModalidad(params.modalidad);
    setCity(params.city);
    setPaginaActual(params.page);
  }, [location.search, getQueryParams]);

  const handleInputChange = (e) => {
    setPendingSearch({ ...pendingSearch, search: e.target.value });
  };
  const handleCategoriaChange = (e) => {
    setPendingSearch({ ...pendingSearch, categoria: e.target.value });
  };
  const handleModalidadChange = (e) => {
    setPendingSearch({ ...pendingSearch, modalidad: e.target.value });
  };
  const handleCityChange = (e) => {
    const value = e.target.value;
    setPendingSearch({ ...pendingSearch, city: value });
    if (value.length > 1 && citiesAll.length > 0) {
      const suggestions = citiesAll.filter(c => c.toLowerCase().includes(value.toLowerCase()));
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]);
    }
  };
  const handleCitySelect = (selectedCity) => {
    setPendingSearch({ ...pendingSearch, city: selectedCity });
    setCitySuggestions([]);
  };
  const handleCityBlur = () => {
    const value = pendingSearch.city;
    if (value.length > 1 && citySuggestions.length > 0) {
      setPendingSearch({ ...pendingSearch, city: citySuggestions[0] });
      setCitySuggestions([]);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setSearch(pendingSearch.search);
    setCategoria(pendingSearch.categoria);
    setModalidad(pendingSearch.modalidad);
    setCity(pendingSearch.city);
    setPaginaActual(1); // Reiniciar a la página 1

    const params = new URLSearchParams();
    if (pendingSearch.search) params.set("search", pendingSearch.search);
    if (pendingSearch.categoria) params.set("categoria", pendingSearch.categoria);
    if (pendingSearch.modalidad) params.set("modalidad", pendingSearch.modalidad);
    if (pendingSearch.city) params.set("city", pendingSearch.city);
    params.set("page", "1");

    navigate({ search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    fetchPublicaciones({ search, categoria, modalidad, city });
    // eslint-disable-next-line
  }, [search, categoria, modalidad, city]);

  useEffect(() => {
    async function cargarCities() {
      const all = await fetchCities("");
      setCitiesAll(all);
    }
    cargarCities();
  }, []);

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

  // PAGINACIÓN
  const publicacionesPorPagina = 9;
  const totalPaginas = Math.ceil(publicaciones.length / publicacionesPorPagina);
  const indiceInicio = (paginaActual - 1) * publicacionesPorPagina;
  const indiceFin = indiceInicio + publicacionesPorPagina;
  const publicacionesPaginadas = publicaciones.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    const params = new URLSearchParams(location.search);
    params.set("page", nuevaPagina.toString());
    navigate({ search: params.toString() }, { replace: true });

    // Scroll al contenedor de publicaciones
    setTimeout(() => {
      if (publicacionesRef.current) {
        publicacionesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); // Pequeña espera para asegurar que se renderice
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título */}
        <section className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold mb-4">
            <FaSearch className="text-blue-500" size={18} />
            Explora servicios
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Encuentra el servicio que necesitas</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Navega por cientos de publicaciones y conecta con trabajadores de distintas áreas en Chile.
          </p>
        </section>

        {/* Filtros */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <form className="flex flex-col sm:flex-row items-center gap-4" onSubmit={handleBuscar}>
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={pendingSearch.search}
                onChange={handleInputChange}
                placeholder="Buscar por palabra clave..."
                className="pl-10 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 text-lg w-full"
              />
            </div>

            {/* Ciudad */}
            <div className="relative w-full sm:w-auto flex-1 min-w-[160px] max-w-xs">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={pendingSearch.city}
                onChange={handleCityChange}
                onBlur={handleCityBlur}
                placeholder="Ciudad..."
                className="pl-10 py-3 border border-blue-200 rounded-lg text-lg bg-white w-full focus:ring-blue-500"
                autoComplete="off"
              />
              {citySuggestions.length > 0 && (
                <ul className="absolute z-10 left-0 right-0 bg-white border border-blue-200 rounded-lg mt-1 shadow-lg max-h-40 overflow-y-auto">
                  {citySuggestions.map((c) => (
                    <li
                      key={c}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                      onMouseDown={() => handleCitySelect(c)}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Categoría */}
            <div className="relative w-full sm:w-auto flex-1 min-w-[160px] max-w-xs">
              <select
                value={pendingSearch.categoria}
                onChange={handleCategoriaChange}
                className="appearance-none p-3 pr-10 border border-blue-200 rounded-lg text-lg bg-white w-full focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={18} />
            </div>

            {/* Modalidad */}
            <div className="relative w-full sm:w-auto flex-1 min-w-[160px] max-w-xs">
              <select
                value={pendingSearch.modalidad}
                onChange={handleModalidadChange}
                className="appearance-none p-3 pr-10 border border-blue-200 rounded-lg text-lg bg-white w-full focus:ring-blue-500"
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

        {/* Resultados */}
        <section ref={publicacionesRef}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Publicaciones Disponibles</h2>
          {loading ? (
            <div className="text-center py-10 text-blue-600 font-semibold text-xl">Cargando publicaciones...</div>
          ) : (publicaciones.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-lg">No hay publicaciones disponibles en este momento.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicacionesPaginadas.map((servicio) => (
                  <Link
                    key={servicio.id}
                    to={`/servicio/${servicio.id}`}
                    className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl hover:border-blue-500 transition-all h-[260px] flex flex-col"
                  >
                    <h3 className="font-bold text-2xl mb-2 text-blue-700 truncate">{servicio.titulo}</h3>
                    <p className="text-gray-600 text-base mb-2 flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold text-xs">{servicio.categoria}</span>
                      <span className="border border-green-200 text-green-700 px-2 py-1 rounded text-xs">{servicio.modalidad}</span>
                    </p>
                    <p className="text-gray-700 mb-2 line-clamp-3">{servicio.descripcion}</p>
                    <p className="text-gray-500 text-xs mt-auto flex items-center gap-1">
                      <FaCalendarAlt className="w-3 h-3" />
                      {servicio.createdAt}
                      <FaMapMarkerAlt className="w-3 h-3 ml-2" />
                      {servicio.city}
                    </p>
                  </Link>
                ))}
              </div>
              {/* Paginación */}
              <div className="flex justify-center items-center mt-8 gap-4">
                <button
                  disabled={paginaActual === 1}
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  className={`px-4 py-2 rounded-lg font-semibold border ${
                    paginaActual === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white hover:bg-blue-100 text-blue-600 border-blue-300"
                  }`}
                >
                  Anterior
                </button>
                <span className="text-lg font-medium text-gray-700">
                  Página {paginaActual} de {totalPaginas}
                </span>
                <button
                  disabled={paginaActual === totalPaginas}
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold border ${
                    paginaActual === totalPaginas
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white hover:bg-blue-100 text-blue-600 border-blue-300"
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Explore;
