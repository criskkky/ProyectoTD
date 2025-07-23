// Regiones y ciudades principales de Chile
export const chileRegionsCities = [
  {
    name: "Región XIII",
    cities: ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes", "San Bernardo", "Peñalolén", "Pudahuel", "Lo Barnechea", "Quilicura", "Recoleta", "Renca", "Macul", "Ñuñoa", "Providencia", "La Reina", "Estación Central", "Cerro Navia", "Conchalí", "El Bosque", "La Cisterna", "La Granja", "Lo Espejo", "Lo Prado", "Pedro Aguirre Cerda", "San Joaquín", "San Miguel", "San Ramón", "Vitacura"]
  },
  {
    name: "Región VIII",
    cities: ["Concepción", "Talcahuano", "Coronel", "San Pedro de la Paz", "Hualpén", "Chiguayante", "Los Ángeles", "Lota", "Penco", "Tomé", "Cabrero", "Nacimiento", "Yumbel", "Mulchén", "Arauco", "Cañete", "Lebu", "Florida", "Hualqui", "Santa Bárbara", "Tucapel"]
  },
  // ...
];

export async function populateRegionsAndCities(regionRepository, cityRepository) {
  const cityMap = {};
  for (const reg of chileRegionsCities) {
    const region = await regionRepository.save(regionRepository.create({ name: reg.name }));
    for (const cityName of reg.cities) {
      const city = await cityRepository.save(cityRepository.create({ name: cityName, region: region }));
      cityMap[cityName] = city;
    }
  }
  return { cityMap };
}
