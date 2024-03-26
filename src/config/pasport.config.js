const passport = require("passport");
const local = require("passport-local");
const jwt = require("passport-jwt");
const { userModel } = require("../model/user.model");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const { SECRET_JWT } = require("../utils/jwt");
const ROLES = require("../constants/role.constants");

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  /*
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        console.log(
          "🚀 ~ file: passport.config.js:17 ~ username: REGISTER STRATEGY",
          username
        );

        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await userModel.findOne({ email });
          console.log("🚀 ~ file: passport.config.js:19 ~ user:", user);
          if (user) {
            // el usuario existe
            return done(null, false);
          }
          const pswHashed = await createHashValue(password);

          const addUser = {
            first_name,
            last_name,
            email,
            age,
            password: pswHashed,
          };

          const newUser = await userModel.create(addUser); // promesa

          if (!newUser) {
            return res
              .status(500)
              .json({ message: `we have some issues register this user` });
          }

          return res.redirect("/login");

        } catch (error) {
          return done(`error getting user ${error}`);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          console.log("***LOGIN STRATEGY***");
          const user = userModel.findOne({ email: username });

          if (!user) {
            console.log('User does not exist in DB');
            return done(null, false);
          }

          console.log(password);
          console.log(user.password);

          if (!isValidPasswd(password, user.password)) {
            console.log('User password it not the same in DB');
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          console.log("error:", error);

          return done(error);
        }
      }
    )
  );
  */

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET_JWT,
      },
      async (jwtPayload, done) => {
        console.log("jwtPayload:", jwtPayload);

        try {
          if (ROLES.includes(jwtPayload.role)) {
            return done(null, jwtPayload);
          }
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });

};

module.exports = initializePassport;