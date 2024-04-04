const express = require("express");
const { setConnection } = require("./connection");
const router = require("./routes/auth")
const cookieParser = require('cookie-parser');
const cors = require("cors");
const dotenv = require('dotenv');
const userRouter = require("./routes/users");
const linkRouter = require("./routes/links");
const passport = require('./passport-config');
dotenv.config();

//variables
const url = process.env.MONGO_DB_CLUSTER_URL;
const app = express();
const PORT = process.env.PORT || 5000;

//connection
setConnection(url);
app.use(passport.initialize());

//middlewares
app.use(cors({ origin: ['https://link-union.netlify.app', 'https://accounts.google.com'], credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/", router);
app.use("/users", userRouter);
app.use("/user", linkRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT -> ${PORT}`);
});
