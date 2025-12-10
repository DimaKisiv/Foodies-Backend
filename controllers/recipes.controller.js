import * as RecipesService from "../services/recipes.service.js";
import HttpError from "../utils/HttpError.js";

export async function listRecipes(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      ownerId,
      category,
      area,
      search,
      ingredientIds,
    } = req.query;
    const ids =
      typeof ingredientIds === "string" && ingredientIds.length > 0
        ? ingredientIds
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;
    const result = await RecipesService.listRecipes({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      ownerId,
      category,
      area,
      search,
      ingredientIds: ids,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await RecipesService.getRecipeById(id);
    if (!recipe) throw HttpError(404, "Recipe not found");
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

export async function listPopularRecipes(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await RecipesService.listPopularRecipes({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
