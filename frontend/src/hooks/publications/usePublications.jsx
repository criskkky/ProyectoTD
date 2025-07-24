import { useState, useEffect, useCallback } from "react";
import { getPublicaciones, updatePublicacion, deletePublicacion, createPublicacion } from "@/services/publi.service.js";
import { showErrorAlert, showSuccessAlert } from "@/helpers/sweetAlert";

const usePublications = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPublicaciones = useCallback(async (filtros = {}) => {
    setLoading(true);
    try {
      const data = await getPublicaciones(filtros);
      setPublicaciones(data);
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      showErrorAlert("Error", "No se pudieron cargar las publicaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCrearPublicacion = async (newData) => {
    try {
      const nuevaPublicacion = await createPublicacion(newData);
      // Si el backend responde con error de límite, mostrar alerta específica
      if (nuevaPublicacion?.statusCode === 403 && nuevaPublicacion?.message?.toLowerCase().includes("límite de publicaciones")) {
        showErrorAlert("Límite alcanzado", nuevaPublicacion.message);
        return;
      }
      setPublicaciones((prev) => [...prev, nuevaPublicacion]);
      showSuccessAlert("¡Creado!", "La publicación ha sido creada exitosamente.");
    } catch (error) {
      // Si el error viene como respuesta del backend
      if (error?.response?.status === 403 && error?.response?.data?.message?.toLowerCase().includes("límite de publicaciones")) {
        showErrorAlert("Límite alcanzado", error.response.data.message);
        return;
      }
      console.error("Error al crear publicación:", error);
      showErrorAlert("Error", "No se pudo crear la publicación.");
    }
  };

  const handleEditarPublicacion = async (id, updatedData) => {
    try {
      const response = await updatePublicacion(id, updatedData);
      if (
        response?.status?.toLowerCase() === "client error" &&
        response?.statusCode === 403 &&
        response?.message?.toLowerCase().includes("permisos")
      ) {
        showErrorAlert("Error", response?.message || "No tienes permisos para editar esta publicación.");
        return;
      }
      setPublicaciones((prev) =>
        prev.map((publi) => (publi.id === id ? response : publi))
      );
      showSuccessAlert("¡Actualizado!", "La publicación ha sido actualizada.");
    } catch (error) {
      console.error("Error al editar publicación:", error);
      showErrorAlert("Error", "No se pudo editar la publicación.");
    }
  };

  const handleEliminarPublicacion = async (id) => {
    try {
      const response = await deletePublicacion(id);
      if (
        response?.status?.toLowerCase() === "client error" &&
        response?.statusCode === 403 &&
        response?.message?.toLowerCase().includes("permisos")
      ) {
        showErrorAlert("Error", response?.message || "No tienes permisos para eliminar esta publicación.");
        return;
      }
      setPublicaciones((prev) => prev.filter((publi) => publi.id !== id));
      showSuccessAlert("¡Eliminado!", "La publicación ha sido eliminada.");
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      showErrorAlert("Error", "No se pudo eliminar la publicación.");
    }
  };

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones]);

  return {
    publicaciones,
    loading,
    fetchPublicaciones,
    handleCrearPublicacion,
    handleEditarPublicacion,
    handleEliminarPublicacion,
  };
};

export default usePublications;