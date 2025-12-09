import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Area = sequelize.define(
  "area",
  {
    id: {
      // areas.json -> _id.$oid
      type: DataTypes.STRING(24),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "areas",
    underscored: true,
    timestamps: false,
  }
);
