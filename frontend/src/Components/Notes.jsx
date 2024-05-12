import { useEffect, useRef, useState } from "react";
import * as API from "../api/index.js";

function Notes() {
  const newNote = useRef();
  const [notes, setNotes] = useState([]);

  const getNotes = async () => {
    const notes = await API.getNotes();
    setNotes(notes);
  };

  const addNote = async () => {
    if (newNote.current.value.trim() === "") return alert("can't add empty note");
    const addedNote = await API.addNote({ note: newNote.current.value });
    setNotes([...notes, addedNote]);
    newNote.current.value = "";
  };

  const deleteNote = async (noteId) => {
    const newDataset = notes.filter((note) => note._id !== noteId);
    setNotes(newDataset);
    await API.deleteNote({ noteId });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="container container--notes" aria-label="notes_container">
      <h3>Notes</h3>
      <div className="container__addnote" aria-label="add_note_form">
        <input
          type="text"
          placeholder="add new note"
          ref={newNote}
          aria-label="input-new_note"
        />
        <button onClick={addNote} aria-label="button-add_note">
          Add
        </button>
      </div>
      <ul className="container__notes" aria-label="notes_list">
        {notes?.map((noteItem) => (
          <li key={noteItem._id} className="notes__item" aria-label="note_item">
            {noteItem.note}
            <button
              onClick={() => {
                deleteNote(noteItem._id);
              }}
              aria-label="button-delete_note"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
