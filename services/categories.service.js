import { Category } from "../models/index.js";

export async function listCategories() {
  return await Category.findAll({ order: [["name", "ASC"]] });
}
