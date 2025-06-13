import { useState, useEffect, useCallback } from "react";
import { getPublicaciones, updatePublicacion, deletePublicacion } from "@/services/publi.service.js";
import { showErrorAlert, showSuccessAlert } from "@/helpers/sweetAlert";

const usePublications = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPublicaciones = useCallback(async (userId = null) => {
    setLoading(true);
    try {
      const data = await getPublicaciones(userId);
      setPublicaciones(data);
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      showErrorAlert("Error", "No se pudieron cargar las publicaciones.");
    } finally {
      setLoading(false);
    }
  }, []); // <- Memoriza la función para evitar recrearla en cada renderizado

  const handleEditarPublicacion = async (id, updatedData) => {
    try {
      const updatedPublicacion = await updatePublicacion(id, updatedData);
      setPublicaciones((prev) =>
        prev.map((publi) => (publi.id === id ? updatedPublicacion : publi))
      );
      showSuccessAlert("¡Actualizado!", "La publicación ha sido actualizada.");
    } catch (error) {
      console.error("Error al editar publicación:", error);
      showErrorAlert("Error", "No se pudo editar la publicación.");
    }
  };

  const handleEliminarPublicacion = async (id) => {
    try {
      await deletePublicacion(id);
      setPublicaciones((prev) => prev.filter((publi) => publi.id !== id));
      showSuccessAlert("¡Eliminado!", "La publicación ha sido eliminada.");
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      showErrorAlert("Error", "No se pudo eliminar la publicación.");
    }
  };

  useEffect(() => {
    fetchPublicaciones(); // Llama a fetchPublicaciones sin userId por defecto
  }, [fetchPublicaciones]);

  return {
    publicaciones,
    loading,
    fetchPublicaciones,
    handleEditarPublicacion,
    handleEliminarPublicacion,
  };
};

export default usePublications;