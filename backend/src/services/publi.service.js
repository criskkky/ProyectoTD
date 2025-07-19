"use strict";
import Publication from "../entity/publi.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getPubliService({ id }) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    const publication = await publiRepository.findOne({
      where: { id: Number(id) },
      relations: ["createdBy"], // Solo si necesitas traer el usuario creador
    });
    if (!publication) return [null, "Publicación no encontrada"];
    return [publication, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getPublisService({ search = "", categoria = "", modalidad = "" } = {}) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    // Construir filtros dinámicos
    let where = {};
    if (categoria) where.categoria = categoria;
    if (modalidad) where.modalidad = modalidad;

    // Consulta base
    let query = publiRepository.createQueryBuilder("publication");
    query.leftJoinAndSelect("publication.createdBy", "createdBy");

    // Filtros por categoría y modalidad
    if (categoria) query.andWhere("publication.categoria = :categoria", { categoria });
    if (modalidad) query.andWhere("publication.modalidad = :modalidad", { modalidad });

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
    const publiRepository = AppDataSource.getRepository(Publication);
    const publication = await publiRepository.findOne({ where: { id: Number(id) } });
    if (!publication) return [null, "Publicación no encontrada"];

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

export async function createPubliService(data) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    const newPublication = publiRepository.create(data);
    const savedPublication = await publiRepository.save(newPublication);
    return [savedPublication, null];
  } catch (error) {
    return [null, error.message];
  }
}