"use strict";
import {
  createPubliService,
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
    const { id } = req.params;
    const { error } = publiQueryValidation.validate({ id });

    if (error) return handleErrorClient(res, 400, error.message);

    const [publication, errorPublication] = await getPubliService({ id });

    if (errorPublication) return handleErrorClient(res, 404, errorPublication);

    if (!req.user) {
      // Campos públicos + ciudad y región
      const publicFields = {
        id: publication.id,
        titulo: publication.titulo,
        categoria: publication.categoria,
        modalidad: publication.modalidad,
        descripcion: publication.descripcion,
        createdAt: publication.createdAt,
        city: publication.city ? {
          id: publication.city.id,
          name: publication.city.name,
          region: publication.city.region ? {
            id: publication.city.region.id,
            name: publication.city.region.name
          } : null
        } : null,
      };
      return handleSuccess(res, 200, "Publicación encontrada", publicFields);
    }

    // Si está autenticado, devuelve todo incluyendo ciudad y región
    const fullFields = {
      ...publication,
      city: publication.city ? {
        id: publication.city.id,
        name: publication.city.name,
        region: publication.city.region ? {
          id: publication.city.region.id,
          name: publication.city.region.name
        } : null
      } : null,
    };
    handleSuccess(res, 200, "Publicación encontrada", fullFields);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getPublications(req, res) {
  try {
    // Leer filtros desde query params
    const { search = "", categoria = "", modalidad = "", city = "" } = req.query;

    // Pasar los filtros al service
    const [publications, errorPublications] = await getPublisService({ search, categoria, modalidad, city });

    if (errorPublications) return handleErrorClient(res, 404, errorPublications);

    if (publications.length === 0) {
      handleSuccess(res, 204);
    } else {
      // Mapear cada publicación para incluir ciudad y región
      const mapped = publications.map(pub => ({
        ...pub,
        city: pub.city ? {
          id: pub.city.id,
          name: pub.city.name,
          region: pub.city.region ? {
            id: pub.city.region.id,
            name: pub.city.region.name
          } : null
        } : null,
      }));
      handleSuccess(res, 200, "Publicaciones encontradas", mapped);
    }
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updatePublication(req, res) {
  try {
    const { id } = req.params;
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

    // Obtener publicación actual para verificar permisos
    const [currentPublication, errorCurrent] = await getPubliService({ id });
    if (errorCurrent) return handleErrorClient(res, 404, errorCurrent);

    // Permitir solo si es el creador o admin
    if (req.user.rol !== "admin" && currentPublication.createdBy.id !== req.user.id) {
      return handleErrorClient(res, 403, "No tienes permisos para editar esta publicación");
    }

    // Si el admin quiere bloquear, puede cambiar el estado
    if (req.user.rol !== "admin" && body.estado === "bloqueado") {
      return handleErrorClient(res, 403, "No tienes permisos para bloquear esta publicación");
    }

    const [publication, publicationError] = await updatePubliService({ id }, body);
    if (publicationError) return handleErrorClient(res, 400, "Error modificando la publicación", publicationError);
    handleSuccess(res, 200, "Publicación modificada correctamente", publication);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deletePublication(req, res) {
  try {
    const { id } = req.params;

    const { error: queryError } = publiQueryValidation.validate({ id });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    // Obtener publicación actual para verificar permisos
    const [currentPublication, errorCurrent] = await getPubliService({ id });
    if (errorCurrent) return handleErrorClient(res, 404, errorCurrent);

    // Si la publicación está bloqueada, solo el admin puede eliminarla
    if (currentPublication.estado === "bloqueado" && req.user.rol !== "admin") {
      return handleErrorClient(res, 403, "Solo el administrador puede eliminar publicaciones bloqueadas");
    }

    // Permitir solo si es el creador o admin
    if (req.user.rol !== "admin" && currentPublication.createdBy.id !== req.user.id) {
      return handleErrorClient(res, 403, "No tienes permisos para eliminar esta publicación");
    }

    const [publicationDelete, errorPublicationDelete] = await deletePubliService({ id });
    if (errorPublicationDelete) {
      return handleErrorClient(res, 404, "Error eliminando la publicación", errorPublicationDelete);
    }
    handleSuccess(res, 200, "Publicación eliminada correctamente", publicationDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createPublication(req, res) {
  try {
    const userId = req.user.id;
    const userRol = req.user.rol;
    // Agregar automáticamente el campo createdBy al cuerpo de la solicitud
    const bodyWithCreatedBy = {
      ...req.body,
      createdBy: userId,
    };

    const { error: bodyError } = publiBodyValidation.validate(bodyWithCreatedBy);
    if (bodyError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );
    }

    // Validación de límite de publicaciones en el service
    const [publication, publicationError] = await createPubliService(bodyWithCreatedBy, userRol, userId);

    if (publicationError && publicationError.startsWith("Límite de publicaciones")) {
      return handleErrorClient(res, 403, publicationError);
    }
    if (publicationError)
      return handleErrorClient(res, 400, "Error creando la publicación", publicationError);

    handleSuccess(res, 201, "Publicación creada correctamente", publication);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}