import axios from './root.service.js';

export async function fetchCiudades(query) {
  // Si query es vacío, pedir todas las ciudades
  try {
    const { data } = await axios.get('/cities', { params: { q: query || '' } });
    // El backend responde con { code, status, message, data: { cities: [...] } }
    return data?.data?.cities || [];
  } catch (error) {
    console.error('Error obteniendo ciudades:', error);
    return [];
  }
}
