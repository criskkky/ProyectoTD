"use strict";
import { DataSource } from "typeorm";
import { DB_NAME, DB_USER, HOST, DB_PASSWORD, DB_PORT } from "./configEnv.js";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ["src/entity/**/*.js"],
  synchronize: true,
  logging: false, // SQL logs
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Base de datos conectada correctamente");
  } catch (error) {
    console.error("[!] Se produjo un error al conectar a la base de datos:", error);
    process.exit(1);
  }
}
