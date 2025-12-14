import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
    },
    password:{
      type:String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
