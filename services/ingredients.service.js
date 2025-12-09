import { Ingredient } from "../models/index.js";

export async function listIngredients() {
  return await Ingredient.findAll({ order: [["name", "ASC"]] });
}
