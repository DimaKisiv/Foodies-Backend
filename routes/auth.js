import { Router } from "express";
import {
  register,
  login,
  logout,
  current,
  updateAvatar,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import upload from "../middlewares/upload.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: uri
 *             required: [name, email, password]
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/logout", authMiddleware, logout);

/**
 * @swagger
 * /auth/current:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Not authorized
 */
router.get("/current", authMiddleware, current);

/**
 * @swagger
 * /auth/avatars:
 *   patch:
 *     tags: [Auth]
 *     summary: Update user avatar
 *     description: Uploads a new avatar image for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *           encoding:
 *             avatar:
 *               contentType: image/png, image/jpeg, image/jpg
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid file or request
 *       401:
 *         description: Not authorized
 */
router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;
