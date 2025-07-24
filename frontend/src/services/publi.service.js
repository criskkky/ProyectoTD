import axios from './root.service.js';
import { formatPublicacionData } from '@/helpers/formatData.js';

export async function getPublicaciones({ search = "", categoria = "", modalidad = "" } = {}) {
    try {
        const params = {};
        if (search) params.search = search;
        if (categoria) params.categoria = categoria;
        if (modalidad) params.modalidad = modalidad;
        const { data } = await axios.get('/posts/', { params });
        const formattedData = data.data.map(formatPublicacionData);
        return formattedData;
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        return [];
    }
}

export async function updatePublicacion(id, data) {
    try {
        const response = await axios.patch(`/posts/${id}`, data);
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

export async function getPublicacionById(id) {
    try {
        const { data } = await axios.get(`/posts/${id}`);
        return formatPublicacionData(data.data);
    } catch (error) {
        console.error("Error al obtener publicación:", error);
        return null;
    }
}