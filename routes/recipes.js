import { Router } from "express";
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
import authMiddleware from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import {
  createRecipeSchema,
  updateRecipeSchema,
} from "../schemas/recipes.schema.js";

const router = Router();

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
 *         description: Filter by recipe area (e.g. Italian)
 *       - in: query
 *         name: ingredientIds
 *         schema:
 *           type: string
 *         description: Comma-separated ingredient IDs to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by recipe title (case-insensitive substring)
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", listRecipes);

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
 *         description: Filter by recipe area (e.g. Italian)
 *       - in: query
 *         name: ingredientIds
 *         schema:
 *           type: string
 *         description: Comma-separated ingredient IDs to filter by
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
router.get("/own", authMiddleware, listOwnRecipes);

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
router.get("/popular", listPopularRecipes);

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
router.get("/favorites", authMiddleware, listFavoriteRecipes);

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
router.post("/", authMiddleware, validate(createRecipeSchema), createRecipe);

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
router.post("/:id/favorite", authMiddleware, addFavoriteRecipe);

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
router.delete("/:id/favorite", authMiddleware, removeFavoriteRecipe);

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
router.get("/:id", getRecipeById);

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
router.patch(
  "/:id",
  authMiddleware,
  validate(updateRecipeSchema),
  updateRecipe
);

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
router.delete("/:id", authMiddleware, deleteRecipe);

export default router;
