import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Favorite = sequelize.define(
  "favorite",
  {
    userId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "user_id",
    },
    recipeId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "recipe_id",
    },
  },
  {
    tableName: "favorites",
    underscored: true,
    timestamps: true,
  }
);
