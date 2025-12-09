import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Follower = sequelize.define(
  "follower",
  {
    userId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "user_id",
    },
    followerId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "follower_id",
    },
  },
  {
    tableName: "followers",
    underscored: true,
    timestamps: true,
  }
);
