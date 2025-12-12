import { Router } from "express";
import { listIngredients } from "../controllers/ingredients.controller.js";

const router = Router();
/**
 * @swagger
 * /ingredients:
 *   get:
 *     tags: [Ingredients]
 *     summary: List ingredients
 *     responses:
 *       200:
 *         description: OK
 *     security: []
 */
router.get("/", listIngredients);
export default router;
