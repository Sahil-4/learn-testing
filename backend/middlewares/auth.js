import jwt from "jsonwebtoken";
import User from "../models/user.js";

// middleware to verify the access token
export const verifyAccessToken = async (req, res, next) => {
  try {
    // extract accessToken from request headers
    const accessToken = req.headers.accesstoken;

    // return 401 if accessToken was not found in headers
    if (!accessToken) return res.status(401).json({ success: false, message: "unauthorized request" });

    // verify the token - check expiry and extract its payload (userId, username)
    const { userId } = jwt.verify(accessToken, "salt123");

    // find the user with this userId and match header accessToken with user object accessToken
    const user = await User.findById(userId);

    // if no user found or the accessToken of user in database is different from one which is passed in headers 
    if (!user || user.accessToken != accessToken) return res.status(401).json({ success: false, message: "unauthorized request" });

    // if everything is fine set req userId and call next
    req.userId = userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ messsage: "un-authorised request" });
  }
};

// middleware to verify the refresh token
export const verifyRefreshToken = async (req, res, next) => {
  try {
    // extract refreshToken from request headers
    const refreshToken = req.headers.refreshtoken;

    // return 401 if refreshToken was not found in headers
    if (!refreshToken) return res.status(401).json({ success: false, message: "unauthorized request" });

    // verify the token - check expiry and extract its payload (userId, username)
    const { userId } = jwt.verify(refreshToken, "salt123");

    // find the user with this userId and match header refreshToken with user object refreshToken
    const user = await User.findById(userId);

    // if no user found or the refreshToken of user in database is different from one which is passed in headers 
    if (!user || user.refreshToken != refreshToken) return res.status(401).json({ success: false, message: "unauthorized request" });

    // if everything is fine set req userId and call next
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ messsage: "un-authorised request" });
  }
};
