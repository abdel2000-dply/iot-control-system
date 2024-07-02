import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import redisClient from '../utils/redis';
import logger from '../utils/logger';

dotenv.config();

class AuthController {
  // Register a new user
  static async Register(req, res) {
    const { username, email, password } = req.body;
    if (!username) {
      logger.error('Missing username');
      return res.status(400).json({ error: 'Missing username' });
    }
    if (!email) {
      logger.error('Missing email');
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      logger.error('Missing password');
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if the user already exists
      const user = await User.findOne({ email });
      if (user) {
        logger.error(`User already exists: ${email}`)
        return res.status(409).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      
      await newUser.save();

      logger.info(`User registered: ${email}`);
      return res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      logger.error(`User registration error: ${error.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Login a user
  static async Login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid Password' })
      }
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5d' });

      await redisClient.set(user._id.toString(), refreshToken, 5 * 24 * 60 * 60);

      return res.json({ token, refreshToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Log out a user
  static async Logout(req, res) {
    const userId = req.user.id;

    try {
      await redisClient.del(userId.toString());
      return res.status(204).end();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Refresh token
  static async Refresh (req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const storedToken = await redisClient.get(decoded.userId.toString());

      if (refreshToken !== storedToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const user = await User.findOne({ _id: decoded.userId });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // we also can update the refresh token here for security reasons
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
}

export default AuthController;
