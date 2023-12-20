const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express(); //initialize express

app.use(morgan("dev")); // Connect the morgan middleware for logging information about requests and responses

app.use(cookieParser()); // cookie-parser middleware for parsing cookies
app.use(express.json()); //parsing JSON bodies of requests with Content-Type of "application/json"

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
); // The csurf middleware will add a _csrf cookie that is HTTP-only (can't be read by JavaScript)
const routes = require("./routes");
app.use(routes); //Connect all the routes
module.exports = app;
