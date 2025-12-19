import * as RecipesService from "../services/recipes.service.js";
import * as UsersService from "../services/users.service.js";
import { saveRecipeThumb } from "../utils/recipeThumb.js";
import HttpError from "../utils/HttpError.js";
import { absolutizeRecipeThumb } from "../utils/url.js";

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
    const items = absolutizeRecipeThumb(result.items, req);
    res.json({ ...result, items });
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

    const result = await RecipesService.listFavoriteRecipesForUser({
      userId: user.id,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      category,
      area,
      search,
      ingredientIds: ids,
    });
    const items = absolutizeRecipeThumb(result.items, req);
    res.json({ ...result, items });
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
    const items = absolutizeRecipeThumb(result.items, req);
    res.json({ ...result, items });
  } catch (err) {
    next(err);
  }
}

export async function getRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await RecipesService.getRecipeById(id);
    if (!recipe) throw HttpError(404, "Recipe not found");
    res.json(absolutizeRecipeThumb(recipe, req));
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

    // Create first to get the recipe id
    const created = await RecipesService.createRecipe(payload);

    // If an image was uploaded, save it under /public/recipes/{id}.{ext}
    if (req.file) {
      const saved = await saveRecipeThumb(req.file, created.id);
      if (saved?.thumbURL) {
        await RecipesService.updateRecipe(created.id, {
          thumb: saved.thumbURL,
        });
      }
    }

    const recipe = await RecipesService.getRecipeById(created.id);
    res.status(201).json(absolutizeRecipeThumb(recipe, req));
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

    const changes = { ...req.body };
    // If a new image was uploaded, save and point thumb to it
    if (req.file) {
      const saved = await saveRecipeThumb(req.file, id);
      if (saved?.thumbURL) changes.thumb = saved.thumbURL;
    }

    const updated = await RecipesService.updateRecipe(id, changes);
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
    const items = absolutizeRecipeThumb(result.items, req);
    res.json({ ...result, items });
  } catch (err) {
    next(err);
  }
}
