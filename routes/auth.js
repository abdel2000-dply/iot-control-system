import express from 'express';
import AuthController from '../controllers/AuthController';

const authRoutes = express.Router();

// Register a new user
authRoutes.post('/register', AuthController.Register);

// Log in a user
authRoutes.post('/login', AuthController.Login);

// Log out a user ==> Add this
// Refresh token ==> Add this

// Forgot password ==> Add this  (not important for now)
// Reset password ==> Add this  (not important for now)

export default authRoutes;
