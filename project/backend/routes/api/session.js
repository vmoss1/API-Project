// This file will hold the resources for the route paths beginning with /api/session
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

//* Log in
router.post("/", async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    // turn off the default scope so that you can read all the attributes of the user including hashedPassword.
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });
  // if a user with those credentials isn't found in the database, then create a "Login failed"
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
    return next(err);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

//* Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

module.exports = router;