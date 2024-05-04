import { Schema, Types, model } from "mongoose";

// note schema
const noteSchema = new Schema(
  {
    note: String,
    userId: Types.ObjectId,
  },
  {
    timeseries: true,
  }
);

// note model
const Note = new model("Note", noteSchema);
export default Note;
