import express from 'express';
import AuthController from '../controllers/AuthController';
import auth from '../middleware/auth';

const authRoutes = express.Router();

// Register a new user
authRoutes.post('/register', AuthController.Register);

// Log in a user
authRoutes.post('/login', AuthController.Login);

// Log out a user ==> Add this
authRoutes.post('/logout', auth, AuthController.Logout);

// Refresh token ==> Add this
authRoutes.post('/refresh-token', AuthController.Refresh);

export default authRoutes;
