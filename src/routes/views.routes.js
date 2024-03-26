const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get("/", (req, res) => {
  res.render("index", {})
})

// Ruta de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta de registro de usuario
router.post('/register', passport.authenticate('register', {
  successRedirect: '/login',
  failureRedirect: '/register',
  failureFlash: true
}));

// Ruta de login de usuario
router.post('/login', passport.authenticate('login', {
  successRedirect: '/pagina_protegida',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports = router;
