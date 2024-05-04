import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

// express app for server
const app = express();

// cors configurations
const corsOptions = {
  origin: "*",
};

// configure server
app.use(cors(corsOptions)); // for CORS
app.use(express.json()); // to use req body

// home route
app.get("/", (req, res) => {
  res.send("you are on homepage.");
});

// handle user or authentication related requests
app.use("/users", userRoutes);

// handle notes related requests
app.use("/notes", noteRoutes);

// start server
app.listen(5000, async (err) => {
  if (err) throw err;
  // connect database
  await mongoose.connect("mongodb://localhost:27017/notes");
  console.log("connected");
});
