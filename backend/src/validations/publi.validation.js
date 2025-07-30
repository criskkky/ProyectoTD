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
    .pattern(/^(?!.*(https?:\/\/|www\.|\d|\.|\b[a-zA-Z0-9._%+-]+\.(com|cl|net|org|info|es|co|edu|gov|mx|ar|pe|ec|uy|ve|br|fr|de|it|pt|ru|jp|cn|in)\b)).*$/i)
    .messages({
      "string.base": "El título debe ser de tipo string.",
      "string.empty": "El título no puede estar vacío.",
      "string.min": "El título debe tener al menos 3 caracteres.",
      "string.max": "El título debe tener como máximo 255 caracteres.",
      "any.required": "El título es requerido.",
      "string.pattern.base": "El título no puede contener números, puntos, enlaces ni dominios, solo texto.",
    }),
  estado: Joi.string()
    .valid("activo", "inactivo", "bloqueado")
    .required()
    .messages({
      "any.only": "El estado debe ser activo, inactivo o bloqueado.",
      "any.required": "El estado es requerido.",
    }),
  descripcion: Joi.string()
    .min(20)
    .max(2000)
    .required()
    .pattern(/^(?!.*(https?:\/\/|www\.|\d|\b[a-zA-Z0-9._%+-]+\.(com|cl|net|org|info|es|co|edu|gov|mx|ar|pe|ec|uy|ve|br|fr|de|it|pt|ru|jp|cn|in)\b)).*$/i)
    .messages({
      "string.base": "La descripción debe ser de tipo string.",
      "string.empty": "La descripción no puede estar vacía.",
      "string.min": "La descripción debe tener al menos 20 caracteres.",
      "string.max": "La descripción debe tener como máximo 2000 caracteres.",
      "any.required": "La descripción es requerida.",
      "string.pattern.base": "La descripción no puede contener números, enlaces ni dominios, solo palabras.",
    }),
  direccion: Joi.string().max(255).optional().messages({
    "string.max": "La dirección debe tener como máximo 255 caracteres."
  }),
  city: Joi.number().integer().required().messages({
    "number.base": "La ciudad debe ser un ID numérico válido.",
    "any.required": "La ciudad es obligatoria."
  }),
  etiquetas: Joi.array().items(Joi.string().max(30)).max(3).optional().messages({
    "array.base": "Las etiquetas deben ser un arreglo de palabras clave.",
    "string.max": "Cada etiqueta debe tener como máximo 30 caracteres.",
    "array.max": "Máximo 3 etiquetas permitidas."
  }),
  contacto_email: Joi.string().email().required().messages({
    "string.email": "El email de contacto debe ser válido."
  }),
  contacto_whatsapp: Joi.string().max(12).optional().messages({
    "string.max": "El WhatsApp debe tener como máximo 12 caracteres."
  }),
  contacto_telefono: Joi.string().max(12).optional().messages({
    "string.max": "El teléfono debe tener como máximo 12 caracteres."
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
    .required()
    .messages({
      "any.only": "La categoría debe ser una de las permitidas.",
    }),
  createdBy: Joi.number()
    .integer()
    .positive()
    .optional(),
}).unknown(false);
