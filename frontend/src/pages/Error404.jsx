const Error404 = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h3 className="mt-4 text-2xl">~ Página no encontrada ~</h3>
        <h4 className="mt-2 text-lg text-gray-600">
          Lo sentimos, la página que estás buscando no existe.
        </h4>
      </div>
    </main>
  );
};

export default Error404;