const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const JWT = require("jsonwebtoken");

const postsRouter = require("./routes/posts");
const tokensRouter = require("./routes/tokens");
const usersRouter = require("./routes/users");

const app = express();

// setup for receiving JSON
app.use(express.json())

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

// // Below is code that made it possible to pass CORS policy when creating a post
// app.options('/posts', (req, res) => {
//   // Set the appropriate CORS headers for the preflight request
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//   res.sendStatus(200); // Send a 200 OK response
// });

// // Below is code that made it possible to pass CORS policy when creating a message
// app.options('/posts/:id', (req, res) => {
//   // Set the appropriate CORS headers for the preflight request
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//   res.sendStatus(200); // Send a 200 OK response
// });

// // Below is code that made it possible to pass CORS policy when checking server status
// app.options('/health', (req, res) => {
//   // Set the appropriate CORS headers for the preflight request
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//   res.sendStatus(200); // Send a 200 OK response
// });

// Added CORS policy
app.use((req, res, next) => { // call the use method, which adds a middleware function to the middleware stack
  // set the response header to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  // res.setHeader('Access-Control-Allow-Origin', 'https://farcebook-9uwa.onrender.com');
  // res.setHeader('Access-Control-Allow-Origin', 'https://farcebook-9uwa.onrender.com/');
  // set the response header to allow the following headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
  // set the response header to allow the following methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // call the next function which will be executed in the middleware stack
  next();
});

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
