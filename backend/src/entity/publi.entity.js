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
