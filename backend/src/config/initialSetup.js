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
        password: await encryptPassword("admin123"),
        rol: "admin",
      })
    );

    // Crear una oferta para el usuario admin
    await publiRepository.save(
      publiRepository.create({
        titulo: "Oferta de ejemplo",
        descripcion: "Esta es una oferta de ejemplo creada automáticamente.",
        precio: 100.00,
        modalidad: "online",
        profesional: adminUser,
      })
    );

    console.log("* => Usuarios y oferta creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };
