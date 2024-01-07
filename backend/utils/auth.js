// three functions that will aid in user authentication

// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Set JWT token cookie after a user is logged in or signed up

const setTokenCookie = (res, user) => {
  // create the token
  const safeUser = {
    id: user.id,
    //! firstName: user.firstName,
    //! lastName: user.lastName,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    {
      data: safeUser,
    },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 sec = 1 week
  );
  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token; // This function will be used in the login and signup routes later.
};

// middleware function called restoreUser that will restore the session user based on the contents of the JWT
// middleware function that will verify and parse the JWT's payload and search the database for a User with the id in the payload
// if a User found in the search, then save the user to a key of user onto the Request (req.user)
const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// authentication middleware to add is for requiring a session user to be authenticated before accessing a route

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = { message: "Authentication required" };
  err.status = 401;
  delete err.stack // removes stack error from response
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
