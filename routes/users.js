import { Router } from "express";
import {
  listUsers,
  getUserDetails,
  listFollowers,
  listFollowersByUserId,
  listFollowing,
  followUser,
  unfollowUser,
  current,
  updateAvatar,
} from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

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
 *     security: []
 */
router.get("/", listUsers);
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
router.get("/followers", authMiddleware, listFollowers);

/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     tags: [Users]
 *     summary: Get followers of a user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size (default 12)
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 *     security: []
 */
router.get("/:id/followers", listFollowersByUserId);

/**
 * @swagger
 * /auth/current:
 *   get:
 *     tags: [Users]
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
 *     tags: [Users]
 *     summary: Update user avatar
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
 *     responses:
 *       200:
 *         description: Avatar updated
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Not authorized
 */
router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

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
router.get("/following", authMiddleware, listFollowing);
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
 *     security: []
 */
router.get("/:id", getUserDetails);
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
router.post("/:id/follow", authMiddleware, followUser);
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
router.delete("/:id/follow", authMiddleware, unfollowUser);

export default router;
