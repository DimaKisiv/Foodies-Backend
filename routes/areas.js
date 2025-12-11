import { Router } from "express";
import { listAreas } from "../controllers/areas.controller.js";

const router = Router();
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
router.get("/", listAreas);
export default router;
