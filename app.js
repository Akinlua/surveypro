require("dotenv").config();
const express = require("express");
const session = require('express-session')
const bodyParser = require("body-parser");
const connectDB = require('./db/connectDB')
const passport = require("passport");
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator');
const cookieParser = require('cookie-parser')

const User = require('./model/user')


const authRouter = require('./routes/auth')
const mainRouter = require('./routes/main')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

const app = express();
require('./middleware/passport');


app.use(express.static("public"));
app.use(bodyParser.json());
// app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use(session({
    secret: process.env.sessionSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2592000000 }
}))

app.use(passport.initialize())
app.use(passport.session())


app.use('', mainRouter)
app.use('', authRouter)


// //error handler
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const port = 5000;
app.listen(port, async () => {
  //connect DB
  await connectDB();
  console.log(`Server is running on port ${port}\n\nhttp://localhost:${port}`);
});
