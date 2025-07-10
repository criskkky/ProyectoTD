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
    ...publicacion,
    titulo: startCase(publicacion.titulo), // Capitaliza el título
    categoria: startCase(publicacion.categoria), // Capitaliza la categoría
    modalidad: startCase(publicacion.modalidad), // Capitaliza la modalidad
    estado: startCase(publicacion.estado), // Capitaliza el estado
    createdAt: formatTempo(publicacion.createdAt, "DD-MM-YYYY"), // Formatea la fecha
  };
}
