import express from 'express';

import AuthController from '../controllers/AuthController';

const router = express.Router();

// Register a new user
router.post('/register', AuthController.Register);

// Log in a user
router.post('/login', AuthController.Login);