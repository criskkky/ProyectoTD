"use strict";
import Publication from "../entity/publi.entity.js";
import CitySchema from "../entity/city.entity.js";
import RegionSchema from "../entity/region.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getPubliService({ id }) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    const publication = await publiRepository.findOne({
      where: { id: Number(id) },
      relations: ["createdBy", "city", "city.region"], // Trae usuario, city y región
    });
    if (!publication) return [null, "Publicación no encontrada"];
    return [publication, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getPublisService({ search = "", categoria = "", modalidad = "", city = "" } = {}) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    // Consulta base
    let query = publiRepository.createQueryBuilder("publication");
    query.leftJoinAndSelect("publication.createdBy", "createdBy");
    query.leftJoinAndSelect("publication.city", "city");
    query.leftJoinAndSelect("city.region", "region");

    // Filtros por categoría y modalidad
    if (categoria) query.andWhere("publication.categoria = :categoria", { categoria });
    if (modalidad) query.andWhere("publication.modalidad = :modalidad", { modalidad });

    // Filtro por city (por nombre, case-insensitive)
    if (city && city.trim()) {
      query.andWhere("LOWER(city.name) = :city", { city: city.trim().toLowerCase() });
    }

    // Filtro por texto (título, descripción, etiquetas)
    if (search.trim()) {
      const s = `%${search.trim().toLowerCase()}%`;
      query.andWhere(
        "(LOWER(publication.titulo) LIKE :s OR LOWER(publication.descripcion) LIKE :s OR LOWER(publication.etiquetas) LIKE :s)",
        { s }
      );
    }

    const publications = await query.getMany();
    return [publications, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function updatePubliService({ id }, data) {
  try {
    const cityRepository = AppDataSource.getRepository(CitySchema);
    const publiRepository = AppDataSource.getRepository(Publication);
    const publication = await publiRepository.findOne({ where: { id: Number(id) } });
    if (!publication) return [null, "Publicación no encontrada"];

    if (data.city) {
      const cityId = Number(data.city);
      if (isNaN(cityId) || cityId <= 0) {
        return [null, "El ID de la ciudad debe ser un número entero positivo"];
      }
      const city = await cityRepository.findOne({ where: { id: cityId }, relations: ["region"] });
      if (!city) {
        return [null, `La ciudad con ID ${cityId} no existe`];
      }
      data.city = city;
    }

    publiRepository.merge(publication, data);
    const updatedPublication = await publiRepository.save(publication);
    return [updatedPublication, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function deletePubliService({ id }) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    const publication = await publiRepository.findOne({ where: { id: Number(id) } });
    if (!publication) return [null, "Publicación no encontrada"];

    await publiRepository.remove(publication);
    return [publication, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function createPubliService(data, userRol, userId) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    const cityRepository = AppDataSource.getRepository(CitySchema);

    // Validar límite de publicaciones por rol
    const rolLimits = {
      user: 2,
      premium: 4,
      premium2: 6,
      admin: 6,
    };
    const maxPosts = rolLimits[userRol] || 2;
    const userPostsCount = await publiRepository.count({ where: { createdBy: { id: userId } } });
    if (userPostsCount >= maxPosts) {
      return [null, `Límite de publicaciones alcanzado para el rol '${userRol}'. Máximo permitido: ${maxPosts}`];
    }

    // Validar que la city existe
    if (!data.city) {
      return [null, "Debe especificar una city válida (city)"];
    }
    const city = await cityRepository.findOne({ where: { id: Number(data.city) }, relations: ["region"] });
    if (!city) {
      return [null, "La city especificada no existe"];
    }
    // Asignar la relación city correctamente
    const newPublication = publiRepository.create({ ...data, city });
    const savedPublication = await publiRepository.save(newPublication);
    return [savedPublication, null];
  } catch (error) {
    return [null, error.message];
  }
}