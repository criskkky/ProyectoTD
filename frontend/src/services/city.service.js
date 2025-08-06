import axios from './root.service.js';

export async function fetchCities(query) {
  try {
    const response = await axios.get('/cities', { params: { q: query || '' } });
    const citiesArray = response.data.data.cities;
    return citiesArray;
  } catch (error) {
    console.error('Error obteniendo ciudades:', error);
    return [];
  }
}