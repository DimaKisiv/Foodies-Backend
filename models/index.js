import { User } from "./User.js";
import { Area } from "./Area.js";
import { Category } from "./Category.js";
import { Ingredient } from "./Ingredient.js";
import { Recipe } from "./Recipe.js";
import { Testimonial } from "./Testimonial.js";
import { Follower } from "./Follower.js";
import { Favorite } from "./Favorite.js";

User.hasMany(Recipe, {
  as: "recipes",
  foreignKey: "ownerId",
  onDelete: "CASCADE",
});
Recipe.belongsTo(User, {
  as: "owner",
  foreignKey: "ownerId",
});

User.hasMany(Testimonial, {
  as: "testimonials",
  foreignKey: "ownerId",
  onDelete: "CASCADE",
});
Testimonial.belongsTo(User, {
  as: "owner",
  foreignKey: "ownerId",
});

User.belongsToMany(User, {
  through: Follower,
  as: "followers",
  foreignKey: "userId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  through: Follower,
  as: "following",
  foreignKey: "followerId",
  otherKey: "userId",
});

User.belongsToMany(Recipe, {
  through: Favorite,
  as: "favoriteRecipes",
  foreignKey: "userId",
  otherKey: "recipeId",
});

Recipe.belongsToMany(User, {
  through: Favorite,
  as: "favoritedBy",
  foreignKey: "recipeId",
  otherKey: "userId",
});

export {
  User,
  Area,
  Category,
  Ingredient,
  Recipe,
  Testimonial,
  Follower,
  Favorite,
};
