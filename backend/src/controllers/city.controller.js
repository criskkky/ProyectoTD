import CitySchema from '../entity/city.entity.js';
import { AppDataSource } from '../config/configDb.js';
import { handleSuccess, handleErrorServer } from '../handlers/responseHandlers.js';

export async function getCities(req, res) {
  try {
    const q = (req.query.q || '').toLowerCase();
    const cityRepository = AppDataSource.getRepository(CitySchema);
    let cities;
    if (q.length > 1) {
      cities = await cityRepository
        .createQueryBuilder('city')
        .select(['city.id', 'city.name']) // Seleccionar solo id y name
        .where('LOWER(city.name) LIKE :q', { q: `%${q}%` })
        .getMany();
    } else {
      cities = await cityRepository.find({
        select: ['id', 'name'] // Seleccionar solo id y name
      });
    }
    // Devolver array de objetos { id, name }
    handleSuccess(res, 200, 'Ciudades encontradas', { cities });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}