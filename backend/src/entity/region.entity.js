import { EntitySchema } from "typeorm";

const RegionSchema = new EntitySchema({
  name: "Region",
  tableName: "regions",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
      unique: true,
    },
  },
  relations: {
    cities: {
      type: "one-to-many",
      target: "City",
      inverseSide: "region",
    },
  },
});

export default RegionSchema;
