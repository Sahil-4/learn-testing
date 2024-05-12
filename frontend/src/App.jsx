import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as API from "./api/index.js";
import Auth from "./Components/Auth.jsx";
import Notes from "./Components/Notes.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetching user profile from localstorage
    const profile = JSON.parse(localStorage.getItem("profile"));
    setUser(profile);
  }, []);

  useEffect(() => {
    // if user is not logged in
    if (!user || !user.accessToken) return;

    // calculate time remaining in token expiry
    const { exp } = jwtDecode(user.accessToken); // decode token to get expiry : exp
    const currTime = Date.now() / 1000; // current time
    const expTime = exp - currTime;

    // settimeout for getting new access token when it gets expired
    const tmr1 = setTimeout(async () => {
      console.log("requesting a new access token");
      const profile = await API.getNewAccessToken();
      setUser(profile); // updating user profile - just to update old access token to new access token
    }, expTime * 1000);

    return () => {
      // remove timeout if component gets unmount
      clearTimeout(tmr1);
    };
  }, [user, setUser]);

  useEffect(() => {
    if (!user || !user.refreshToken) return;

    // calculate time ramaining in token expiry
    const { exp } = jwtDecode(user.refreshToken);
    const currTime = Date.now() / 1000;
    const expTime = exp - currTime;

    // settimeout for log out when refresh token gets expired
    const tmr2 = setTimeout(async () => {
      console.log("requesting log out");
      await API.logOut();
      setUser(null);
    }, expTime * 1000);

    return () => {
      clearTimeout(tmr2);
    };
  }, [user, setUser]);

  return (
    <div className="main" aria-label="main">
      {!user && <Auth user={user} setUser={setUser} />}
      {user && <Notes />}
    </div>
  );
}

export default App;
