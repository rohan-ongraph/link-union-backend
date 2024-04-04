const passport = require('passport');
const { googleStrategy } = require('./controllers/authController');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: "532503575871-3naamp9l7ms1p6qeue6n612ql8n977lf.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://link-union-backend.onrender.com/auth/google/callback"
  },
  googleStrategy
));

module.exports = passport;
