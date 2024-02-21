import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const validate = {};
    if (password.length < 6)
      validate.password = "Password must be more than 6 characters long";
    if (credential.length < 4)
      validate.credential = "Credential must be more than 4 characters";

    setValidations(validate);
  }, [credential, password]);

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
  // console.log(errors.message);

  const handleDemoLogin = async () => {
    setCredential("Demo-lition");
    setPassword("password");
    await handleSubmit(new Event("submit"));
  };

  return (
    <div className="loginForm">
      <h1>Log In Wizard/Witch</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {"credential" in validations && (
          <p className="loginValidations">{validations.credential}</p>
        )}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {"password" in validations && (
          <p className="loginValidations">{validations.password}</p>
        )}
        {errors.message && <p id="invalidCredentials">{errors.message}</p>}
        <div id="loginButton">
          <button
            type="submit"
            disabled={Object.values(validations).length > 0}
          >
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
