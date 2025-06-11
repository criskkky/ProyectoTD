"use strict";
import Offer from "../entity/publi.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getPubliService({ id }) {
  try {
    const offerRepository = AppDataSource.getRepository(Offer);
    const offer = await offerRepository.findOne({
      where: { id: Number(id) },
      relations: ["profesional", "categoria"],
    });
    if (!offer) return [null, "Oferta no encontrada"];
    return [offer, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getPublisService() {
  try {
    const offerRepository = AppDataSource.getRepository(Offer);
    const offers = await offerRepository.find({
      relations: ["profesional", "categoria"],
    });
    return [offers, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function updatePubliService({ id }, data) {
  try {
    const offerRepository = AppDataSource.getRepository(Offer);
    const offer = await offerRepository.findOne({ where: { id: Number(id) } });
    if (!offer) return [null, "Oferta no encontrada"];

    offerRepository.merge(offer, data);
    const updatedOffer = await offerRepository.save(offer);
    return [updatedOffer, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function deletePubliService({ id }) {
  try {
    const offerRepository = AppDataSource.getRepository(Offer);
    const offer = await offerRepository.findOne({ where: { id: Number(id) } });
    if (!offer) return [null, "Oferta no encontrada"];

    await offerRepository.remove(offer);
    return [offer, null];
  } catch (error) {
    return [null, error.message];
  }
}
