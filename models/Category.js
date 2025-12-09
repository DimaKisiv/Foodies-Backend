import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Category = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.STRING(24),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "categories",
    underscored: true,
    timestamps: false,
  }
);
