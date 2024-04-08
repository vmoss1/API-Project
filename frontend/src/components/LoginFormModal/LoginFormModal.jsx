import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        // console.log("server errors", data.errors.message);
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = async () => {
    setCredential("Demo-lition");
    setPassword("password");
    await handleSubmit();
  };

  return (
    <div className="loginForm">
      <h1>Log In Wizard/Witch</h1>
      <form onSubmit={handleSubmit} id="loginForm">
        Username or Email
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        Password
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        {errors.message && <p id="invalidCredentials">{errors.message}</p>}
        <div id="loginButton">
          <button type="submit" disabled={Object.values(errors).length > 0}>
            Log In
          </button>
          <button id="demoButton" type="button" onClick={handleDemoLogin}>
            Login as Demo User
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
