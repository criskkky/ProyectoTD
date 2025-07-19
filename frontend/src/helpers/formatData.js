import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatUserData(user) { // View
  return {
    ...user,
    nombres: startCase(user.nombres),
    apellidos: startCase(user.apellidos),
    rol: startCase(user.rol),
    rut: formatRut(user.rut),
    createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
  };
}

export function convertirMinusculas(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].toLowerCase();
    }
  }
  return obj;
}

export function formatPostUpdate(user) { // Send
  return {
    id: user.id,
    nombres: user.nombres,
    apellidos: user.apellidos,
    rol: user.rol,
    rut: formatRut(user.rut, { dots: false }),
    email: user.email,
    password: user.password ? user.password.trim() : "", // Quita espacios
  };
}

// Formatea los datos de una publicación
export function formatPublicacionData(publicacion) {
  return {
    id: publicacion.id ?? null,
    titulo: startCase(publicacion.titulo ?? ""),
    estado: startCase(publicacion.estado ?? ""),
    descripcion: publicacion.descripcion ?? "No disponible",
    imagenes: Array.isArray(publicacion.imagenes)
      ? publicacion.imagenes
      : (typeof publicacion.imagenes === "string" && publicacion.imagenes)
        ? publicacion.imagenes.split(",")
        : [],
    direccion: publicacion.direccion ?? "No disponible",
    ciudad: publicacion.ciudad ?? "No disponible",
    pais: publicacion.pais ?? "No disponible",
    etiquetas: Array.isArray(publicacion.etiquetas)
      ? publicacion.etiquetas
      : (typeof publicacion.etiquetas === "string" && publicacion.etiquetas)
        ? publicacion.etiquetas.split(",")
        : [],
    contacto_email: publicacion.contacto_email ?? "No disponible",
    contacto_whatsapp: publicacion.contacto_whatsapp ?? "No disponible",
    contacto_telefono: publicacion.contacto_telefono ?? "No disponible",
    enlace_externo: publicacion.enlace_externo ?? "No disponible",
    modalidad: startCase(publicacion.modalidad ?? ""),
    categoria: startCase(publicacion.categoria ?? ""),
    createdAt: publicacion.createdAt ? formatTempo(publicacion.createdAt, "DD-MM-YYYY") : "No disponible",
    updatedAt: publicacion.updatedAt ? formatTempo(publicacion.updatedAt, "DD-MM-YYYY") : "No disponible",
    createdBy: publicacion.createdBy ?? null,
  };
}
