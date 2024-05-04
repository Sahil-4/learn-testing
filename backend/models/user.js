import { Schema, model } from "mongoose";

// user schema
const userSchema = new Schema(
  {
    username: String,
    password: String,
    accessToken: String,
    refreshToken: String,
  },
  {
    timeseries: true,
  }
);

// creating a mongodb model
const User = new model("User", userSchema);
export default User;
