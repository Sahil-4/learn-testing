import { useRef } from "react";
import * as API from "../api/index.js";

function Auth({ setUser }) {
  const username = useRef();
  const password = useRef();

  const handleLogin = async () => {
    // call login function to make login request with username and password
    // then set the user profile
    const profile = await API.login({
      username: username.current.value,
      password: password.current.value,
    });
    setUser(profile);
  };

  const handleSignup = async () => {
    // call signup function to make sign up request with username and password
    // then set the user profile
    const profile = await API.signup({
      username: username.current.value,
      password: password.current.value,
    });
    setUser(profile);
  };

  // for the sake of simplicity I have used just one simple component to login and signup both

  return (
    <div className="container container--auth" aria-label="auth_container">
      <h3>Authenticate</h3>
      <div aria-label="auth-form">
        <input type="text" placeholder="username" ref={username} required aria-label="input-username" />
        <input type="password" placeholder="password" ref={password} required aria-label="input-password" />
        <button onClick={handleLogin} aria-label="button-login">
          Login
        </button>
        <button onClick={handleSignup} aria-label="button-signup">
          Sign up
        </button>
      </div>
    </div>
  );
}

export default Auth;
