"use strict";
import Joi from "joi";

export const offerQueryValidation = Joi.object({
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

export const offerBodyValidation = Joi.object({
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
  precio: Joi.number()
    .precision(2)
    .positive()
    .required()
    .messages({
      "number.base": "El precio debe ser un número.",
      "number.positive": "El precio debe ser positivo.",
      "any.required": "El precio es requerido.",
    }),
  modalidad: Joi.string()
    .valid("presencial", "online", "mixta")
    .required()
    .messages({
      "any.only": "La modalidad debe ser presencial, online o mixta.",
      "any.required": "La modalidad es requerida.",
    }),
  profesional: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El profesional debe ser un id numérico.",
      "any.required": "El profesional es requerido.",
    }),
  categoria: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La categoría debe ser un id numérico.",
      "any.required": "La categoría es requerida.",
    }),
}).unknown(false);
