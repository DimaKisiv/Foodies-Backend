import { Op, fn } from "sequelize";
import { Recipe, Ingredient, User, Favorite } from "../models/index.js";
import { nanoid } from "nanoid";

const RECIPE_OWNER_ATTRIBUTES = ["id", "name", "avatar"];
const DEFAULT_RECIPE_OWNER_INCLUDE = {
  model: User,
  as: "owner",
  attributes: RECIPE_OWNER_ATTRIBUTES,
};

async function expandIngredients(recipeInstance) {
  if (!recipeInstance) return null;
  const recipe = recipeInstance.toJSON();
  const items = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  if (items.length === 0) {
    recipe.ingredientsDetailed = [];
    return recipe;
  }
  const ids = items.map((i) => i.id);
  const ingRows = await Ingredient.findAll({ where: { id: ids } });
  const map = new Map(ingRows.map((i) => [i.id, i.toJSON()]));
  recipe.ingredientsDetailed = items
    .map(({ id, measure }) => ({
      ...map.get(id),
      measure,
    }))
    .filter(Boolean);
  return recipe;
}

export async function createRecipe(payload) {
  const data = { ...payload };
  if (!data.id) {
    data.id = nanoid();
  }
  return await Recipe.create(data);
}

export async function getRecipeById(
  id,
  { includeOwner = true, expand = true } = {}
) {
  const include = includeOwner ? [DEFAULT_RECIPE_OWNER_INCLUDE] : [];
  const rec = await Recipe.findByPk(id, { include });
  if (expand) return await expandIngredients(rec);
  return rec;
}

export async function listRecipes({
  page = 1,
  limit = 20,
  includeRecipeOwners = true,
  ownerId,
  category,
  area,
  search,
  ingredientIds,
} = {}) {
  const where = {};
  if (ownerId) where.ownerId = ownerId;
  if (category) where.category = category;
  if (area) where.area = area;
  if (search) where.title = { [Op.iLike]: `%${search}%` };
  if (Array.isArray(ingredientIds) && ingredientIds.length > 0) {
    const orClauses = ingredientIds.map((id) => ({
      ingredients: { [Op.contains]: [{ id }] },
    }));
    if (orClauses.length === 1) {
      Object.assign(where, orClauses[0]);
    } else {
      where[Op.or] = [...(where[Op.or] || []), ...orClauses];
    }
  }
  const offset = (page - 1) * limit;
  const include = includeRecipeOwners ? [DEFAULT_RECIPE_OWNER_INCLUDE] : [];
  const { rows, count } = await Recipe.findAndCountAll({
    where,
    limit,
    offset,
    include,
    order: [["created_at", "DESC"]],
  });
  const expanded = await Promise.all(rows.map((r) => expandIngredients(r)));
  return { items: expanded, total: count, page, limit };
}

export async function updateRecipe(id, changes) {
  const rec = await Recipe.findByPk(id);
  if (!rec) return null;
  await rec.update(changes);
  return await getRecipeById(id);
}

export async function deleteRecipe(id) {
  return await Recipe.destroy({ where: { id } });
}

export async function listPopularRecipes({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;

  const totalResult = await Favorite.count({
    distinct: true,
    col: "recipeId",
  });

  if (totalResult === 0) {
    return { items: [], total: 0, page, limit };
  }

  const favoriteRows = await Favorite.findAll({
    attributes: ["recipeId", [fn("COUNT", "*"), "favoritesCount"]],
    group: ["recipeId"],
    order: [[fn("COUNT", "*"), "DESC"]],
    offset,
    limit,
    raw: true,
  });

  const recipeIds = favoriteRows.map((row) => row.recipeId);
  const favCountMap = new Map(
    favoriteRows.map((row) => [row.recipeId, Number(row.favoritesCount)])
  );

  const recipes = await Recipe.findAll({
    where: { id: recipeIds },
    include: [DEFAULT_RECIPE_OWNER_INCLUDE],
  });

  const allIngredientIds = recipes.flatMap((r) =>
    Array.isArray(r.ingredients) ? r.ingredients.map((i) => i.id) : []
  );
  const ingredients = await Ingredient.findAll({
    where: { id: [...new Set(allIngredientIds)] },
  });
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i.toJSON()]));

  const items = recipeIds
    .map((id) => {
      const instance = recipes.find((r) => r.id === id);
      if (!instance) return null;
      const recipe = instance.toJSON();
      const ingItems = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : [];
      recipe.ingredientsDetailed = ingItems
        .map(({ id, measure }) => ({ ...ingredientMap.get(id), measure }))
        .filter(Boolean);
      return { ...recipe, favoritesCount: favCountMap.get(id) || 0 };
    })
    .filter(Boolean);

  return { items, total: totalResult, page, limit };
}
