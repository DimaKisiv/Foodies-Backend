import * as CategoriesService from "../services/categories.service.js";

export async function listCategories(req, res, next) {
  try {
    const items = await CategoriesService.listCategories();
    res.json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
}
