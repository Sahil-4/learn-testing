import { Router } from "express";
import User from "../models/user.js";
import { verifyAccessToken, verifyRefreshToken } from "../middlewares/auth.js";
import jwt from "jsonwebtoken";

// express router
const router = Router();

// function to generate Access Token
const generateAccessToken = (userId, username) => {
  // this token will be valid for 120 seconds or 2 minutes
  return jwt.sign({ userId, username }, "salt123", { expiresIn: "120s" });
  // expiry time is kept too short for demo purposes only

  /**
   jwt.sign({ userId, username }, "salt123", { expiresIn: "120s" });
   { userId, username } is the data which we want to encrypt 
   "salt123" is extra salt 
   { expiresIn: "120s" } is options object having expiry time specified 
   */
};

// function to generate Refresh Token
const generateRefreshToken = (userId, username) => {
  // this token will be valid for 200 seconds or 5 minutes
  return jwt.sign({ userId, username }, "salt123", { expiresIn: "300s" });
};

// sign up user
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // find user in database
    const existingUser = await User.findOne({ username, password });

    // send error if user already exists in database
    if (existingUser) return res.status(409).json({ message: "user already exists" });

    // create new user
    const user = await User.create({
      username,
      password,
    });

    // generate access and refresh tokens
    user.accessToken = generateAccessToken(user._id, username);
    user.refreshToken = generateRefreshToken(user._id, username);

    // update access and refresh tokens in user object in database
    await user.save();

    // data to send to client
    const data = {
      userId: user._id,
      username: user.username,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };

    res.status(200).json({ message: "sign up successful", data });
  } catch (error) {
    res.status(500).json({ message: "unable to sign up" });
  }
});

// authenticate the user
router.post("/login", async (req, res) => {
  try {
    // take username and password
    const { username, password } = req.body;

    // find user in database
    const user = await User.findOne({ username, password });

    // create new user if not found
    if (!user) return res.status(404).json({ success: false, message: "user not found" });

    // generate accessToken, refreshToken
    user.accessToken = generateAccessToken(user._id, user.username);
    user.refreshToken = generateRefreshToken(user._id, user.username);

    await user.save();

    // then send profile with accessToken, refreshToken
    const data = {
      userId: user._id,
      username: user.username,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
    res.status(200).json({ message: "login successful.", data });
  } catch (error) {
    res.status(500).json({ message: "unable to login" });
  }
});

router.get("/logout", verifyAccessToken, verifyRefreshToken, async (req, res) => {
    try {
      const { userId } = req;

      await User.findByIdAndUpdate(userId, { accessToken: null, refreshToken: null });

      res.status(200).json({ message: "log out successful" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "unable to logout" });
    }
  }
);

// send new accessToken after verifying refresh token
router.get("/getAccessToken", verifyRefreshToken, async (req, res) => {
  try {
    const { userId, username } = req;

    const user = await User.findOne({ _id: userId });

    user.accessToken = generateAccessToken(userId, username);
    user.save();

    const { accessToken, refreshToken } = user;

    const profile = { userId, username, accessToken, refreshToken };

    res.status(200).json({ message: "access token generated", data: profile });
  } catch (error) {
    res.status(500).json({ message: "unable to generate access token" });
  }
});

export default router;
