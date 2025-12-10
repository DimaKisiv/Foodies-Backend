import { Router } from "express";
import { listUsers } from "../controllers/users.controller.js";
import { listCategories } from "../controllers/categories.controller.js";
import { listIngredients } from "../controllers/ingredients.controller.js";
import {
  listRecipes,
  getRecipeById,
  listPopularRecipes,
} from "../controllers/recipes.controller.js";
import { listTestimonials } from "../controllers/testimonials.controller.js";
import { listAll } from "../controllers/all.controller.js";
import authRouter from "./auth.js";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/users", listUsers);

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

export default router;
