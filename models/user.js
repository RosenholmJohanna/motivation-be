
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlenght: 3,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  });
  
  
  export const User = mongoose.model("User", UserSchema);
  //export default UserSchema;
