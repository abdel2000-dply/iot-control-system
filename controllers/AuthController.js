import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
// import redisClient from '../utils/redis';

dotenv.config();

class AuthController {
  // Register a new user
  static async Register(req, res) {
    const { username, email, password } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Missing username' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if the user already exists
      const user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      
      await newUser.save();

      return res.json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.log(error);
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
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // we can Store the token in Redis
      // to keep a Revocation list of tokens, other future uses
      // await redisClient.set(`auth_${user._id}`, token, 3600);

      return res.json({ token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default AuthController;
