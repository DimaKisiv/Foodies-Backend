import { Op } from "sequelize";
import {
  User,
  Recipe,
  Testimonial,
  Favorite,
  Follower,
} from "../models/index.js";

export async function createUser(payload) {
  return await User.create(payload);
}

export async function getUserById(id, { includeRelations = true } = {}) {
  const include = includeRelations
    ? [
        { model: Recipe, as: "recipes" },
        { model: Testimonial, as: "testimonials" },
        { model: Recipe, as: "favoriteRecipes", through: { attributes: [] } },
        { model: User, as: "followers", through: { attributes: [] } },
        { model: User, as: "following", through: { attributes: [] } },
      ]
    : [];
  return await User.findByPk(id, { include });
}

export async function getUserDetailsById(id) {
  const user = await User.findByPk(id, {
    include: [
      { model: Recipe, as: "recipes", attributes: ["id"] },
      { model: User, as: "followers", attributes: ["id"] },
    ],
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    recipesCount: user.recipes?.length ?? 0,
    followersCount: user.followers?.length ?? 0,
  };
}

export async function listUsers({ page = 1, limit = 20, search } = {}) {
  const offset = (page - 1) * limit;
  const where = search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : undefined;
  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });
  return { items: rows, total: count, page, limit };
}

export async function updateUser(id, changes) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(changes);
  return user;
}

export async function deleteUser(id) {
  return await User.destroy({ where: { id } });
}

export async function addFavorite(userId, recipeId) {
  await Favorite.findOrCreate({ where: { userId, recipeId } });
  return await getUserById(userId);
}

export async function removeFavorite(userId, recipeId) {
  await Favorite.destroy({ where: { userId, recipeId } });
  return await getUserById(userId);
}

export async function followUser(userId, targetUserId) {
  if (userId === targetUserId) return await getUserById(userId);
  await Follower.findOrCreate({
    where: { userId: targetUserId, followerId: userId },
  });
  return await getUserById(userId);
}

export async function unfollowUser(userId, targetUserId) {
  await Follower.destroy({
    where: { userId: targetUserId, followerId: userId },
  });
  return await getUserById(userId);
}

export async function getFollowers(userId) {
  const user = await User.findByPk(userId, {
    include: [{ model: User, as: "followers", through: { attributes: [] } }],
  });
  return user?.followers ?? [];
}

export async function getFollowing(userId) {
  const user = await User.findByPk(userId, {
    include: [{ model: User, as: "following", through: { attributes: [] } }],
  });
  return user?.following ?? [];
}

export async function getFavorites(userId) {
  const user = await User.findByPk(userId, {
    include: [
      { model: Recipe, as: "favoriteRecipes", through: { attributes: [] } },
    ],
  });
  return user?.favoriteRecipes ?? [];
}
