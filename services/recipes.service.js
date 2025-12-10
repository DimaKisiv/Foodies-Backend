import { Op, fn } from "sequelize";
import { Recipe, Ingredient, User, Favorite } from "../models/index.js";

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
  return await Recipe.create(payload);
}

export async function getRecipeById(
  id,
  { includeOwner = true, expand = true } = {}
) {
  const include = includeOwner ? [{ model: User, as: "owner" }] : [];
  const rec = await Recipe.findByPk(id, { include });
  if (expand) return await expandIngredients(rec);
  return rec;
}

export async function listRecipes({
  page = 1,
  limit = 20,
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
  const { rows, count } = await Recipe.findAndCountAll({
    where,
    limit,
    offset,
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

  const total = await Favorite.count({
    distinct: true,
    col: "recipeId",
  });

  if (total === 0) {
    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }

  const favoriteRows = await Favorite.findAll({
    attributes: [
      "recipeId",
      [fn("COUNT", "*"), "favoritesCount"],
    ],
    group: ["recipeId"],
    order: [[fn("COUNT", "*"), "DESC"]],
    offset,
    limit,
    raw: true,
  });

  const recipeIds = favoriteRows.map((row) => row.recipeId);

  const recipes = await Recipe.findAll({
    where: { id: recipeIds },
    include: [{ model: User, as: "owner" }],
  });

  const recipeMap = new Map(recipes.map((r) => [r.id, r]));

  const items = [];
  for (const row of favoriteRows) {
    const instance = recipeMap.get(row.recipeId);
    if (!instance) continue;
    const base = await expandIngredients(instance);
    items.push({
      ...base,
      favoritesCount: Number(row.favoritesCount) || 0,
    });
  }

  return {
    items,
    total,
    page,
    limit,
  };
}
