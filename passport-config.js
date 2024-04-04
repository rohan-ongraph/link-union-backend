const passport = require('passport');
const { googleStrategy } = require('./controllers/authController');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://link-union-backend.onrender.com/auth/google/callback"
  },
  googleStrategy
));

module.exports = passport;
