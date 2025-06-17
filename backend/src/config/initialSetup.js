"use strict";
import User from "../entity/user.entity.js";
import Publication from "../entity/publi.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const publiRepository = AppDataSource.getRepository(Publication);

    const count = await userRepository.count();
    if (count > 0) return;

    const adminUser = await userRepository.save(
      userRepository.create({
        nombres: "Padmin Sadmin",
        apellidos: "Tadmin Cadmin",
        rut: "12345678-1",
        email: "admin@sistema.com",
        password: await encryptPassword("admin1234"),
        rol: "admin",
      })
    );

    // Crear una oferta para el usuario admin
    await publiRepository.save(
      publiRepository.create({
        titulo: "Oferta del admin",
        descripcion: "Esta es una oferta de ejemplo creada automáticamente.",
        modalidad: "online",
        estado: "activo",
        categoria: "tecnología",
        createdBy: adminUser,
      })
    );

    // Agregar un usuario adicional
    const regularUser = await userRepository.save(
      userRepository.create({
        nombres: "Usuario Regular",
        apellidos: "Apellido Regular",
        rut: "12345678-2",
        email: "user@sistema.com",
        password: await encryptPassword("user1234"),
        rol: "user",
      })
    );

    // Crear una oferta para el usuario regular
    await publiRepository.save(
      publiRepository.create({
        titulo: "Oferta del usuario",
        descripcion: "Esta es una oferta de ejemplo creada automáticamente.",
        modalidad: "online",
        estado: "activo",
        categoria: "tecnología",
        createdBy: regularUser,
      })
    );

    console.log("* => Usuarios y ofertas creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };
