import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h3 className="mt-4 text-2xl font-semibold text-gray-800">Página no encontrada</h3>
        <h4 className="mt-2 text-lg text-gray-600">
          Lo sentimos, la página que estás buscando no existe.
        </h4>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>
    </main>
  );
};

export default Error404;