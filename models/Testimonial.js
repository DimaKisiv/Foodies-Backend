import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Testimonial = sequelize.define(
  "testimonial",
  {
    id: {
      type: DataTypes.STRING(24),
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "owner_id",
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "testimonials",
    underscored: true,
    timestamps: true,
  }
);
