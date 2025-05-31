"use strict";
import {
  getOfferService,
  getOffersService,
  updateOfferService,
  deleteOfferService,
} from "../services/offer.service.js";
import {
  offerBodyValidation,
  offerQueryValidation,
} from "../validations/offer.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getOffer(req, res) {
  try {
    const { id } = req.query;
    const { error } = offerQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [offer, errorOffer] = await getOfferService({ id });

    if (errorOffer) return handleErrorClient(res, 404, errorOffer);

    handleSuccess(res, 200, "Oferta encontrada", offer);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getOffers(req, res) {
  try {
    const [offers, errorOffers] = await getOffersService();

    if (errorOffers) return handleErrorClient(res, 404, errorOffers);

    offers.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Ofertas encontradas", offers);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateOffer(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;

    const { error: queryError } = offerQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = offerBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [offer, offerError] = await updateOfferService({ id }, body);

    if (offerError) return handleErrorClient(res, 400, "Error modificando la oferta", offerError);

    handleSuccess(res, 200, "Oferta modificada correctamente", offer);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteOffer(req, res) {
  try {
    const { id } = req.query;

    const { error: queryError } = offerQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [offerDelete, errorOfferDelete] = await deleteOfferService({ id });

    if (errorOfferDelete) return handleErrorClient(res, 404, "Error eliminando la oferta", errorOfferDelete);

    handleSuccess(res, 200, "Oferta eliminada correctamente", offerDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
