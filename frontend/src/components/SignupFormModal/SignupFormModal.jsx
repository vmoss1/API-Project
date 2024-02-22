import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [validations, setValidations] = useState({});

  useEffect(() => {
    const validate = {};

    if (!email) validate.email = "Email must be provided";
    if (!username || username.length < 4)
      validate.username = "Username must be greater than 4 characters";
    if (!firstName) validate.firstName = "First Name must be provided";
    if (!lastName) validate.lastName = "Last Name must be provided";
    if (!password || password.length < 6)
      validate.password = "Password must be greater than 6 characters";
    if (!confirmPassword) validate.confirmPassword = "Please confirm password";
    setValidations(validate);
  }, [email, password, username, firstName, lastName, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div id="formPageSignUp">
      <h1>Sign Up A New Wizard/Witch </h1>
      <h2 id="noMuggles">*NO Muggles*</h2>
      <form id="signUpForm" onSubmit={handleSubmit}>
        Email
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p id="errorsMessage">{errors.email}</p>}
        Username
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {"username" in validations && (
          <p className="validationsSignUp">{validations.username}</p>
        )}
        {errors.username && <p id="errorsMessage">{errors.username}</p>}
        First Name
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p id="errorsMessage">{errors.firstName}</p>}
        Last Name
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p id="errorsMessage">{errors.lastName}</p>}
        Password
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p id="errorsMessage">{errors.password}</p>}
        Confirm Password
        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {"password" in validations && (
          <p className="validationsSignUp">{validations.password}</p>
        )}
        {errors.message && <p id="errorsMessage">{errors.message}</p>}
        <div id="signUp">
          <button
            type="submit"
            disabled={Object.values(validations).length > 0}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
