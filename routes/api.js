import { Router } from "express";
import { listUsers } from "../controllers/users.controller.js";
import { listCategories } from "../controllers/categories.controller.js";
import { listRecipes } from "../controllers/recipes.controller.js";
import { listTestimonials } from "../controllers/testimonials.controller.js";
import { listAll } from "../controllers/all.controller.js";
import { listAreas } from "../controllers/areas.controller.js";
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
 * /recipes:
 *   get:
 *     tags: [Recipes]
 *     summary: List recipes
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/recipes", listRecipes);

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
