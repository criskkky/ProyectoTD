import axios from './root.service.js';
import { formatPublicacionData } from '@/helpers/formatData.js';

export async function getPublicaciones() {
    try {
        const { data } = await axios.get('/posts/');
        const formattedData = data.data.map(formatPublicacionData);
        return formattedData;
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        return [];
    }
}

export async function updatePublicacion(id, data) {
    try {
        console.log("Payload enviado:", data, "ID:", id);
        const response = await axios.patch(`/posts/${id}`, data);
        console.log(response);
        return response.data.data;
    } catch (error) {
        console.error("Error al actualizar publicación:", error);
        return error.response?.data || { error: "Error desconocido" };
    }
}

export async function deletePublicacion(id) {
    try {
        const response = await axios.delete(`/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar publicación:", error);
        return error.response?.data || { error: "Error desconocido" };
    }
}

export async function createPublicacion(data) {
    try {
        const response = await axios.post('/posts/', data);
        return response.data.data;
    } catch (error) {
        console.error("Error al crear publicación:", error);
        return error.response?.data || { error: "Error desconocido" };
    }
}