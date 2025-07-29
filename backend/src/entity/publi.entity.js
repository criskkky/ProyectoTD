"use strict";
import { EntitySchema } from "typeorm";

const PubliSchema = new EntitySchema({
  name: "Publication",
  tableName: "publication",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    titulo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    estado: {
      type: "enum",
      enum: ["activo", "inactivo", "bloqueado"],
      default: "activo",
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    direccion: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    etiquetas: {
      type: "simple-array", // palabras clave separadas por coma
      nullable: true,
    },
    contacto_email: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    contacto_whatsapp: {
      type: "varchar",
      length: 30,
      nullable: true,
    },
    contacto_telefono: {
      type: "varchar",
      length: 30,
      nullable: true,
    },
    enlace_externo: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    modalidad: {
      type: "enum",
      enum: ["presencial", "online", "mixta"],
      nullable: false,
    },
    categoria: {
      type: "enum",
      enum: [
        "arte",
        "construcción",
        "educacion",
        "idiomas",
        "salud",
        "servicios generales",
        "tecnología"
      ],
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    createdBy: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      nullable: false,
      onDelete: "CASCADE",
    },
    city: {
      type: "many-to-one",
      target: "City",
      joinColumn: { name: "city_id" },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_PUBLI",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default PubliSchema;
