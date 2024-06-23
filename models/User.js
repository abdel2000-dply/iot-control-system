// User model
import { Mongoose } from 'mongoose';

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  }
});

const User = Mongoose.model('User', UserSchema);
export default User;
