// Devuelve primer nombre y primer apellido
export function getFirstNameLastName(user) {
  const nombre = user.nombres ? user.nombres.split(' ')[0] : '';
  const apellido = user.apellidos ? user.apellidos.split(' ')[0] : '';
  return `${startCase(nombre)} ${startCase(apellido)}`.trim();
}
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

export function formatPostUpdate(user) {
  const formatted = {
    id: user.id,
    nombres: user.nombres,
    apellidos: user.apellidos,
    rol: user.rol,
    rut: formatRut(user.rut, { dots: false }),
    email: user.email,
  };

  if (user.newPassword && user.newPassword.trim() !== "") {
    formatted.password = user.newPassword.trim(); // 👈 Usa newPassword
  }

  return formatted;
}

// Formatea los datos de una publicación
export function formatPublicacionData(publicacion) {
  return {
    id: publicacion.id ?? null,
    titulo: startCase(publicacion.titulo ?? ""),
    estado: startCase(publicacion.estado ?? ""),
    descripcion: publicacion.descripcion ?? "No disponible",
    direccion: publicacion.direccion ?? "No disponible",
    city: publicacion.city?.name ?? "No disponible",
    region: publicacion.city?.region?.name ?? "No disponible",
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
