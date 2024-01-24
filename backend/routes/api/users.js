// This file will hold the resources for the route paths beginning with /api/users
const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

//* middleware for validating the signup
// It checks to see if req.body.email exists and is an email,
// req.body.username is a minimum length of 4 and is not an email,
//  and req.body.password is not empty and has a minimum length of 6.
// If at least one of the req.body values fail the check, an error will be returned as the response.
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email.")
    .custom(async (value) => {
      // Check if the email is already in use
      const checkEmail = await User.findOne({
        where: { email: value },
      });
      if (checkEmail) {
        throw new Error("User with that email already exists");
      }
    }),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email.")
  .custom(async (value) => {
    // Check if the username is already in use
    const checkUser = await User.findOne({
      where: { username: value },
    });
    if (checkUser) {
      throw new Error("User with that username already exists");
    }
  }),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
    check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a first name."),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a last name."),
  handleValidationErrors,
];

//* Sign up
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
