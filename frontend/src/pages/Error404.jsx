import { useNavigate } from "react-router-dom";
import { MdReply } from "react-icons/md";

const Error404 = () => {
  const navigate = useNavigate();
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="p-10 bg-white rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100 mb-4">
            <span className="text-5xl font-bold text-red-500">404</span>
          </span>
          <h3 className="text-2xl font-semibold text-gray-900">Página no encontrada</h3>
        </div>
        <p className="text-gray-600 mb-6">Lo sentimos, la página que estás buscando no existe o fue movida.</p>
        <button
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold text-base"
          onClick={() => navigate("/")}
        >
          <MdReply className="w-5 h-5" />
          Volver al inicio
        </button>
      </div>
    </main>
  );
};

export default Error404;