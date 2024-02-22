const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const JWT = require("jsonwebtoken");

const postsRouter = require("./routes/posts");
const tokensRouter = require("./routes/tokens");
const usersRouter = require("./routes/users");

const corsOrigin = process.env.CORS_ORIGIN || "*"
// const corsOrigin = process.env.CORS_ORIGIN || "https://farcebook-9uwa.onrender.com"

const app = express();

// setup for receiving JSON
app.use(express.json())

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Define a middleware function for CORS headers
const handleCors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  next();
};

// Use the CORS middleware for specific routes
app.options('/posts', handleCors, (req, res) => {
  res.sendStatus(200);
});

app.options('/posts/:id', handleCors, (req, res) => {
  res.sendStatus(200);
});

// Use the CORS middleware for all routes
app.use(handleCors);


// avatars is the URL path to access the avatars folder
//display the images in the avatars folder
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));


// middleware function to check for valid tokens
const tokenChecker = (req, res, next) => {

  let token;
  const authHeader = req.get("Authorization")

  if(authHeader) {
    token = authHeader.slice(7)
  }

  JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if(err) {
      console.log(err)
      res.status(401).json({message: "auth error"});
    } else {
      req.user_id = payload.user_id;
      next();
    }
  });
};

// route setup
app.get('/health', (req, res) => {
  res.status(200).send('Server is up and running.');
});
app.use("/posts", tokenChecker, postsRouter);
app.use("/tokens", tokensRouter);
app.use("/users", usersRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // respond with details of the error
  res.status(err.status || 500).json({message: 'server error'})
});

module.exports = app;
