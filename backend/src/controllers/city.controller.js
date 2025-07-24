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
        .where('LOWER(city.name) LIKE :q', { q: `%${q}%` })
        .getMany();
    } else {
      cities = await cityRepository.find();
    }
    const cityNames = cities.map(c => c.name);
    console.log(`[CIUDADES] q='${q}' => ${cityNames.length} ciudades encontradas`);
    handleSuccess(res, 200, 'Ciudades encontradas', { cities: cityNames });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
