import { EntitySchema } from "typeorm";

const CitySchema = new EntitySchema({
  name: "City",
  tableName: "cities",
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
    },
  },
  relations: {
    region: {
      type: "many-to-one",
      target: "Region",
      joinColumn: { name: "region_id" },
      nullable: false,
      inverseSide: "cities",
    },
  },
});

export default CitySchema;
