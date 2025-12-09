import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Recipe = sequelize.define(
  "recipe",
  {
    id: {
      type: DataTypes.STRING(24),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "owner_id",
    },
    ingredients: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "recipes",
    underscored: true,
    timestamps: true,
  }
);
