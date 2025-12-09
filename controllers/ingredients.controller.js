import * as IngredientsService from "../services/ingredients.service.js";

export async function listIngredients(req, res, next) {
  try {
    const items = await IngredientsService.listIngredients();
    res.json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
}
