import App from "../App.jsx";
import { expect, test } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

test("test:: render App", () => {
  // render app
  render(<App />);

  // find the main div in screen
  const mainDiv = screen.getByRole("main");

  // check whether main div is in document or not
  expect(mainDiv).toBeInTheDocument();
});

test("test:: signup or login user", async () => {
  // render app
  render(<App />);

  // find auth container and check whether it is in document or not
  const authContainer = screen.getByRole("auth_container");
  expect(authContainer).toBeInTheDocument();

  // find username and password input elements
  const inputUsername = screen.getByRole("input-username");
  const inputPassword = screen.getByRole("input-password");

  // find login button
  const signupButton = screen.getByRole("button-signup");
  const loginButton = screen.getByRole("button-login");

  // variables for username and password
  const username = "username";
  const password = "password";

  // fire input event on input elements
  fireEvent.input(inputUsername, { target: { value: username } });
  fireEvent.input(inputPassword, { target: { value: password } });

  // check value in inputs
  expect(inputUsername.value).toBe(username);
  expect(inputPassword.value).toBe(password);

  let authStatus = "login";

  if (authStatus === "login") {
    // click login button and login user
    fireEvent.click(loginButton);
  } else {
    // click login button and signup user
    fireEvent.click(signupButton);
  }

  // check notes list in document after signup
  const notesList = await waitFor(() => screen.getByRole("notes_container"));
  expect(notesList).toBeInTheDocument();
});

test("test:: check notes container and notes list", () => {
  // render app
  render(<App />);

  // notes container
  expect(screen.getByRole("notes_container")).toBeInTheDocument();

  // notes list
  expect(screen.getByRole("notes_list")).toBeInTheDocument();
});

test("test:: add note", async () => {
  // render app
  render(<App />);

  // notes list (ul)
  let noteItems = await screen.findAllByRole("note_item");

  const numberOfNotes = noteItems.length;
  console.log("numberOfNotes:: ", numberOfNotes);

  const addNoteForm = screen.getByRole("add_note_form");
  expect(addNoteForm).toBeInTheDocument();

  const addNoteInput = screen.getByRole("input-new_note");
  const addNoteButton = screen.getByRole("button-add_note");

  fireEvent.input(addNoteInput, { target: { value: "test:: new note 1" } });
  fireEvent.click(addNoteButton); // ? wait for network request completion

  // check notes count
  noteItems = await waitFor(() => screen.getAllByRole("note_item"));
  expect(noteItems.length).toBe(numberOfNotes + 1);
});
