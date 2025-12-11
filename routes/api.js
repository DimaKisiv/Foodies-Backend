import { Router } from "express";
import {
  listUsers,
  getUserDetails,
  listFollowers,
  listFollowing,
  followUser,
  unfollowUser,
} from "../controllers/users.controller.js";
import { listCategories } from "../controllers/categories.controller.js";
import { listIngredients } from "../controllers/ingredients.controller.js";
import {
  listRecipes,
  listOwnRecipes,
  getRecipeById,
  listPopularRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  listFavoriteRecipes,
} from "../controllers/recipes.controller.js";
import { listTestimonials } from "../controllers/testimonials.controller.js";
import { listAll } from "../controllers/all.controller.js";
import { listAreas } from "../controllers/areas.controller.js";
import authRouter from "./auth.js";
import authMiddleware from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import { createRecipeSchema, updateRecipeSchema } from "../schemas/recipes.schema.js";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size (default 20)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email (case-insensitive substring)
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/users", listUsers);

/**
 * @swagger
 * /users/followers:
 *   get:
 *     tags: [Users]
 *     summary: Get followers of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Not authorized
 */
router.get("/users/followers", authMiddleware, listFollowers);

/**
 * @swagger
 * /users/following:
 *   get:
 *     tags: [Users]
 *     summary: Get users the authenticated user is following
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Not authorized
 */
router.get("/users/following", authMiddleware, listFollowing);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get detailed info about another user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 */
router.get("/users/:id", getUserDetails);

/**
 * @swagger
 * /users/{id}/follow:
 *   post:
 *     tags: [Users]
 *     summary: Follow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to follow
 *     responses:
 *       200:
 *         description: Successfully followed
 *       400:
 *         description: Cannot follow yourself
 *       401:
 *         description: Not authorized
 */
router.post("/users/:id/follow", authMiddleware, followUser);

/**
 * @swagger
 * /users/{id}/follow:
 *   delete:
 *     tags: [Users]
 *     summary: Unfollow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed
 *       401:
 *         description: Not authorized
 */
router.delete("/users/:id/follow", authMiddleware, unfollowUser);

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List categories
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/categories", listCategories);

/**
 * @swagger
 * /ingredients:
 *   get:
 *     tags: [Ingredients]
 *     summary: List ingredients
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/ingredients", listIngredients);

/**
 * @swagger
 * /recipes:
 *   get:
 *     tags: [Recipes]
 *     summary: List recipes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size (default 20)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by recipe category (category name)
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Filter by recipe area (area name, e.g. Italian)
 *       - in: query
 *         name: ingredientIds
 *         schema:
 *           type: string
 *         description: Comma-separated list of ingredient IDs to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by recipe title (case-insensitive substring)
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/recipes", listRecipes);

/**
 * @swagger
 * /recipes:
 *   post:
 *     tags: [Recipes]
 *     summary: Create a recipe for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructions:
 *                 type: string
 *               thumb:
 *                 type: string
 *               time:
 *                 type: integer
 *               category:
 *                 type: string
 *               area:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     measure:
 *                       type: string
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post(
  "/recipes",
  authMiddleware,
  validate(createRecipeSchema),
  createRecipe
);

/**
 * @swagger
 * /recipes/own:
 *   get:
 *     tags: [Recipes]
 *     summary: List recipes of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size (default 20)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by recipe category (category name)
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Filter by recipe area (area name, e.g. Italian)
 *       - in: query
 *         name: ingredientIds
 *         schema:
 *           type: string
 *         description: Comma-separated list of ingredient IDs to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by recipe title (case-insensitive substring)
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Not authorized
 */
router.get("/recipes/own", authMiddleware, listOwnRecipes);

/**
 * @swagger
 * /recipes/popular:
 *   get:
 *     tags: [Recipes]
 *     summary: List popular recipes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size (default 20)
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/recipes/popular", listPopularRecipes);

/**
 * @swagger
 * /recipes/favorites:
 *   get:
 *     tags: [Recipes]
 *     summary: Get favorite recipes of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Not authorized
 */
router.get("/recipes/favorites", authMiddleware, listFavoriteRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     tags: [Recipes]
 *     summary: Get recipe by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Recipe not found
 */
router.get("/recipes/:id", getRecipeById);

/**
 * @swagger
 * /recipes/{id}:
 *   patch:
 *     tags: [Recipes]
 *     summary: Update a recipe owned by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructions:
 *                 type: string
 *               thumb:
 *                 type: string
 *                 format: uri
 *               time:
 *                 type: integer
 *               category:
 *                 type: string
 *               area:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     measure:
 *                       type: string
 *     responses:
 *       200:
 *         description: Recipe updated
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not the owner)
 *       404:
 *         description: Recipe not found
 */
router.patch("/recipes/:id", authMiddleware, validate(updateRecipeSchema), updateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     tags: [Recipes]
 *     summary: Delete a recipe owned by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not the owner)
 *       404:
 *         description: Recipe not found
 */
router.delete("/recipes/:id", authMiddleware, deleteRecipe);

/**
 * @swagger
 * /recipes/{id}/favorite:
 *   post:
 *     tags: [Recipes]
 *     summary: Add a recipe to favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Added to favorites
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Recipe not found
 */
router.post("/recipes/:id/favorite", authMiddleware, addFavoriteRecipe);

/**
 * @swagger
 * /recipes/{id}/favorite:
 *   delete:
 *     tags: [Recipes]
 *     summary: Remove a recipe from favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Removed from favorites
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Recipe not found
 */
router.delete("/recipes/:id/favorite", authMiddleware, removeFavoriteRecipe);

/**
 * @swagger
 * /testimonials:
 *   get:
 *     tags: [Testimonials]
 *     summary: List testimonials
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/testimonials", listTestimonials);

/**
 * @swagger
 * /all:
 *   get:
 *     tags: [All]
 *     summary: List all data
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/all", listAll);
router.use("/auth", authRouter);

/**
 * @swagger
 * /areas:
 *   get:
 *     tags: [Areas]
 *     summary: List areas
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/areas", listAreas);

export default router;
