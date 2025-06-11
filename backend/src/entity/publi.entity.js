"use strict";
import { EntitySchema } from "typeorm";

const PubliSchema = new EntitySchema({
  name: "Offer",
  tableName: "offers",
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
    precio: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    modalidad: {
      type: "enum",
      enum: ["presencial", "online", "mixta"],
      nullable: false,
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
    /*
    categoria: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "categoriaId" },
      nullable: false,
    },
    */
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
