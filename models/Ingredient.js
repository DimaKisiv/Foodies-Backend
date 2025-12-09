import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Ingredient = sequelize.define(
  "ingredient",
  {
    id: {
      type: DataTypes.STRING(24),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "ingredients",
    underscored: true,
    timestamps: false,
  }
);
