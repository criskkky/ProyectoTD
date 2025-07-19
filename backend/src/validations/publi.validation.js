"use strict";
import Joi from "joi";

export const publiQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
      "any.required": "El id es requerido.",
    }),
}).unknown(false);

export const publiBodyValidation = Joi.object({
  titulo: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.base": "El título debe ser de tipo string.",
      "string.empty": "El título no puede estar vacío.",
      "string.min": "El título debe tener al menos 3 caracteres.",
      "string.max": "El título debe tener como máximo 255 caracteres.",
      "any.required": "El título es requerido.",
    }),
  descripcion: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      "string.base": "La descripción debe ser de tipo string.",
      "string.empty": "La descripción no puede estar vacía.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción debe tener como máximo 2000 caracteres.",
      "any.required": "La descripción es requerida.",
    }),
  imagenes: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
    "array.base": "Las imágenes deben ser un arreglo de URLs.",
    "string.uri": "Cada imagen debe ser una URL válida.",
    "array.max": "Máximo 10 imágenes permitidas."
  }),
  direccion: Joi.string().max(255).optional().messages({
    "string.max": "La dirección debe tener como máximo 255 caracteres."
  }),
  ciudad: Joi.string().max(100).optional().messages({
    "string.max": "La ciudad debe tener como máximo 100 caracteres."
  }),
  pais: Joi.string().max(100).optional().messages({
    "string.max": "El país debe tener como máximo 100 caracteres."
  }),
  etiquetas: Joi.array().items(Joi.string().max(30)).max(10).optional().messages({
    "array.base": "Las etiquetas deben ser un arreglo de palabras clave.",
    "string.max": "Cada etiqueta debe tener como máximo 30 caracteres.",
    "array.max": "Máximo 10 etiquetas permitidas."
  }),
  contacto_email: Joi.string().email().optional().messages({
    "string.email": "El email de contacto debe ser válido."
  }),
  contacto_whatsapp: Joi.string().max(30).optional().messages({
    "string.max": "El WhatsApp debe tener como máximo 30 caracteres."
  }),
  contacto_telefono: Joi.string().max(30).optional().messages({
    "string.max": "El teléfono debe tener como máximo 30 caracteres."
  }),
  enlace_externo: Joi.string().uri().optional().messages({
    "string.uri": "El enlace externo debe ser una URL válida."
  }),
  modalidad: Joi.string()
    .valid("presencial", "online", "mixta")
    .required()
    .messages({
      "any.only": "La modalidad debe ser presencial, online o mixta.",
      "any.required": "La modalidad es requerida.",
    }),
  categoria: Joi.string()
    .valid(
      "arte",
      "construcción",
      "educacion",
      "salud",
      "servicios generales",
      "tecnología"
    )
    .optional()
    .messages({
      "any.only": "La categoría debe ser una de las permitidas.",
    }),
  createdBy: Joi.number()
    .integer()
    .positive()
    .optional(),
}).unknown(false);
