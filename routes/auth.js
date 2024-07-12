import express from 'express';
import AuthController from '../controllers/AuthController';
import auth from '../middleware/auth';

const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint allows a new user to register in the system.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user
 *                 required: true
 *               email:
 *                 type: string
 *                 description: The email of the new user
 *                 required: true
 *               password:
 *                 type: string
 *                 description: The password of the new user
 *                 required: true
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *        description: User already exists
 */
authRoutes.post('/register', AuthController.Register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: This endpoint allows a registered user to log in.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 required: true
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 required: true
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Missing required fields or invalid credentials
 */
authRoutes.post('/login', AuthController.Login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: This endpoint allows an authenticated user to log out.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
authRoutes.post('/logout', auth, AuthController.Logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh token
 *     description: This endpoint allows a user to refresh their authentication token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *                 required: true
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Missing or invalid refresh token
 */
authRoutes.post('/refresh-token', AuthController.Refresh);

authRoutes.get('/me', auth, AuthController.getMe);

export default authRoutes;
