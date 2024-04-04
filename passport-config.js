const passport = require('passport');
const { googleStrategy } = require('./controllers/authController');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: '532503575871-3naamp9l7ms1p6qeue6n612ql8n977lf.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://link-union-backend.onrender.com/auth/google/callback"
  },
  googleStrategy
));

module.exports = passport;
