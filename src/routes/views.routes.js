const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isValidPasswd } = require("../utils/encrypt");
const { userModel } = require("../model/user.model");
const { generateJWT } = require("../utils/jwt");

router.get("/", (req, res) => {
  res.render("index", {})
})

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await userModel.findOne({ email });
  //console.log("findUser:", findUser);

  if (!findUser) {
    return res
      .status(401)
      .json({ message: `este usuario no esta registrado` });
  }

  const isValidComparePsw = await isValidPasswd(password, findUser.password);
  if (!isValidComparePsw) {
    return res.status(401).json({ message: `credenciales invalidas` });
  }

  const {
    first_name,
    last_name,
    email: emailDb,
    age,
    role,
    carts,
  } = findUser;

  const token = await generateJWT({
    first_name,
    last_name,
    email: emailDb,
    age,
    role,
    carts,
    id: findUser._id,
  });

  res.cookie('token', token, { httpOnly: true });
  //res.json({ message: 'Login exitoso' });
  res.redirect('profile');
});

const authenticate = passport.authenticate('current', { session: false });
router.get('/profile', authenticate, async (req, res) => {
  const user = req.user;
  res.render('profile', { user: user });
});

router.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

module.exports = router;
