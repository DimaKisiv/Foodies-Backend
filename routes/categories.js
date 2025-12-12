import { Router } from "express";
import { listCategories } from "../controllers/categories.controller.js";

const router = Router();
/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List categories
 *     responses:
 *       200:
 *         description: OK
 *     security: []
 */
router.get("/", listCategories);
export default router;
