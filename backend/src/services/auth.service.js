"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { TOKEN_JWT } from "../config/configEnv.js";
import { format as formatRut } from "rut.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email }
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      id: userFound.id,
      nombres: userFound.nombres,
      apellidos: userFound.apellidos,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, TOKEN_JWT, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombres, apellidos, rut, email } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const formattedRut = formatRut(rut, { dots: false });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (existingEmailUser) return [null, createErrorMessage("email", "Este correo ya está asociado a una cuenta")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut: formattedRut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    const newUser = userRepository.create({
      nombres,
      apellidos,
      email,
      rut: formattedRut,
      password: await encryptPassword(user.password),
      rol: "user",
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
