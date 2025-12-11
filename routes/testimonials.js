import { Router } from "express";
import { listTestimonials } from "../controllers/testimonials.controller.js";

const router = Router();
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
router.get("/", listTestimonials);
export default router;
