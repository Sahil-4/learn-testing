import axios from "axios";

// axios instance
const API = axios.create({ baseURL: "http://localhost:5000" });

// configuring axios instance to send accessToken and refreshToken everytime a netword request is made
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  if (user) {
    req.headers.accesstoken = user.accessToken;
    req.headers.refreshtoken = user.refreshToken;
  }

  return req;
});

// functions to make api call for login request with username and password in body
export const login = async ({ username, password }) => {
  try {
    const response = await API.post("/users/login", { username, password });
    const profile = response.data.data;
    localStorage.setItem("profile", JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// functions to make api call for signup request with username and password in body
export const signup = async ({ username, password }) => {
  try {
    const response = await API.post("/users/signup", { username, password });
    const profile = response.data.data;
    localStorage.setItem("profile", JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// function to make api call to generate new access token and get profile of user
export const getNewAccessToken = async () => {
  try {
    const response = await API.get("/users/getAccessToken");
    const profile = response.data.data;
    localStorage.setItem("profile", JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// function to log out user and make api call to remove access and refresh token from user object in database
export const logOut = async () => {
  try {
    localStorage.removeItem("profile");
    await API.get("/users/logout");
    return {
      username: "",
      password: "",
      accessToken: null,
      refreshToken: null,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// function to make get list/array of notes of current logged in user
export const getNotes = async () => {
  try {
    const response = await API.get("/notes/get");
    const notes = response.data.data;
    return notes;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// make network request to add a new note in database
export const addNote = async ({ note }) => {
  try {
    const response = await API.post("/notes/add", { note });
    const addedNote = response.data.data;
    return addedNote;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// make network request to delete a note from database using note id
export const deleteNote = async ({ noteId }) => {
  try {
    const response = await API.get(`/notes/delete/${noteId}`);
    const deletedNote = response.data.data;
    return deletedNote;
  } catch (error) {
    console.log(error);
    return null;
  }
};
