import { Router } from "express";
import Note from "../models/note.js";
import { verifyAccessToken } from "../middlewares/auth.js";

// express router 
const router = Router();

// verify access token of user and then create a new note in database if access token in valid
router.post("/add", verifyAccessToken, async (req, res) => {
  try {
    const { note } = req.body;
    const { userId } = req;

    const newNote = await Note.create({ note, userId });

    res.status(200).json({ message: "note added", data: newNote });
  } catch (error) {
    res.status(500).json({ message: "unable to add note" });
  }
});

// verify access token of user and then send all notes of user in database to user if access token in valid
router.get("/get", verifyAccessToken, async (req, res) => {
  try {
    const { userId } = req;

    const notes = await Note.find({ userId });

    res.status(200).json({ message: "notes fetched", data: notes });
  } catch (error) {
    res.status(500).json({ message: "unable to fetch notes" });
  }
});

// verify access token of user and then delete the note having _id : noteId if access token in valid
router.get("/delete/:noteId", verifyAccessToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req;

    await Note.findOneAndDelete({ _id: noteId, userId });

    res.status(200).json({ message: "note deleted" });
  } catch (error) {
    res.status(500).json({ message: "unable to delete note" });
  }
});

export default router;
