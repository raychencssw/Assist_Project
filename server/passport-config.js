const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const bcrypt = require("bcrypt");
//configuration for passport
function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    console.log("Start authentication process");
    //Check if user exists
    const user = await User.findOne({ email });
    if (user == null) {
      console.log("Email does not exist");
      return done(null, false);
    }

    try {
      if (!user.validPassword(password)) {
        console.log("Invalid password");
        return done(null, false);
      } else {
        console.log("Login success!");
        return done(null, user);
      }
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser)); //register the authentication strategy that the passport is going to use
  passport.serializeUser((user, done) => done(null, user));   //passport calls this function and store it(here, the whole user object) in the session when a user log in
  passport.deserializeUser((user, done) => done(null, user)); //passport calls this function to get the data stored in the session
}

module.exports = initialize;
