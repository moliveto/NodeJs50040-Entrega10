const passport = require("passport");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const { userModel } = require("../model/user.model");
const { SECRET_JWT } = require("../utils/jwt");

const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const ROLES = require("../constants/role.constants");

// const local = require("passport-local");
// const localStrategy = local.Strategy;

function extractJwtFromCookie(req) {
  const cookies = req.cookies;
  if (!cookies || !cookies.token) {
    return null;
  }
  return cookies.token;
}

const initializePassport = () => {

  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: extractJwtFromCookie,
        secretOrKey: SECRET_JWT,
      },
      async (payload, done) => {
        //console.log("jwtPayload:", payload);
        const user = payload.user;
        console.log(user);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      }
    )
  );

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