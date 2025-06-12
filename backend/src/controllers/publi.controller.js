"use strict";
import {
  getPubliService,
  getPublisService,
  updatePubliService,
  deletePubliService,
} from "../services/publi.service.js";
import {
  publiBodyValidation,
  publiQueryValidation,
} from "../validations/publi.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getPublication(req, res) {
  try {
    const { id } = req.query;
    const { error } = publiQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [publication, errorPublication] = await getPubliService({ id });

    if (errorPublication) return handleErrorClient(res, 404, errorPublication);

    handleSuccess(res, 200, "Publicación encontrada", publication);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getPublications(req, res) {
  try {
    const [publications, errorPublications] = await getPublisService();

    if (errorPublications) return handleErrorClient(res, 404, errorPublications);

    publications.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Publicaciones encontradas", publications);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updatePublication(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;

    const { error: queryError } = publiQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = publiBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [publication, publicationError] = await updatePubliService({ id }, body);

    if (publicationError) return handleErrorClient(res, 400, "Error modificando la publicación", publicationError);

    handleSuccess(res, 200, "Publicación modificada correctamente", publication);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deletePublication(req, res) {
  try {
    const { id } = req.query;

    const { error: queryError } = publiQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [publicationDelete, errorPublicationDelete] = await deletePubliService({ id });

    if (errorPublicationDelete) return handleErrorClient(res, 404, "Error eliminando la publicación", errorPublicationDelete);

    handleSuccess(res, 200, "Publicación eliminada correctamente", publicationDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
