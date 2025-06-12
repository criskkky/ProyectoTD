"use strict";
import Publication from "../entity/publi.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getPubliService({ id }) {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    const publication = await publiRepository.findOne({
      where: { id: Number(id) },
      relations: ["profesional", "categoria"],
    });
    if (!publication) return [null, "Publicación no encontrada"];
    return [publication, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getPublisService() {
  try {
    const publiRepository = AppDataSource.getRepository(Publication);
    const publications = await publiRepository.find({
      relations: ["profesional", "categoria"],
    });
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
