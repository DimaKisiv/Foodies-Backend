import * as RecipesService from "../services/recipes.service.js";
import * as UsersService from "../services/users.service.js";
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

export async function addFavoriteRecipe(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const { id: recipeId } = req.params;

    const recipe = await RecipesService.getRecipeById(recipeId, {
      includeOwner: false,
      expand: false,
    });
    if (!recipe) throw HttpError(404, "Recipe not found");

    const updatedUser = await UsersService.addFavorite(user.id, recipeId);
    res.json({ favorites: updatedUser.favoriteRecipes ?? [] });
  } catch (err) {
    next(err);
  }
}

export async function removeFavoriteRecipe(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const { id: recipeId } = req.params;

    const recipe = await RecipesService.getRecipeById(recipeId, {
      includeOwner: false,
      expand: false,
    });
    if (!recipe) throw HttpError(404, "Recipe not found");

    const updatedUser = await UsersService.removeFavorite(user.id, recipeId);
    res.json({ favorites: updatedUser.favoriteRecipes ?? [] });
  } catch (err) {
    next(err);
  }
}

export async function listFavoriteRecipes(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");
    const favorites = await UsersService.getFavorites(user.id);
    res.json({ items: favorites, total: favorites.length });
  } catch (err) {
    next(err);
  }
}

export async function listOwnRecipes(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");

    const {
      page = 1,
      limit = 20,
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
      ownerId: user.id,
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

export async function createRecipe(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");

    const payload = {
      ...req.body,
      ownerId: user.id,
    };

    const created = await RecipesService.createRecipe(payload);
    const recipe = await RecipesService.getRecipeById(created.id);
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
}

export async function updateRecipe(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");

    const { id } = req.params;
    const recipe = await RecipesService.getRecipeById(id, {
      includeOwner: false,
      expand: false,
    });
    if (!recipe) throw HttpError(404, "Recipe not found");
    if (recipe.ownerId !== user.id) throw HttpError(403, "Forbidden");

    const updated = await RecipesService.updateRecipe(id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteRecipe(req, res, next) {
  try {
    const user = req.user;
    if (!user) throw HttpError(401, "Not authorized");

    const { id } = req.params;
    const recipe = await RecipesService.getRecipeById(id, {
      includeOwner: true,
      expand: false,
    });
    if (!recipe) throw HttpError(404, "Recipe not found");
    if (recipe.ownerId !== user.id) throw HttpError(403, "Forbidden");

    await RecipesService.deleteRecipe(id);
    res.status(204).send();
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
