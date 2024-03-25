const { Router } = require("express");
const { getAllProducts, } = require("../model/products.model");
const { authMdw, auth } = require("../middleware/auth.middleware");

const router = Router();

router.get("/", (req, res) => {
  res.render("index", {})
})

router.get(`/login`, async (req, res) => {
  res.render("login");
});

router.get(`/register`, async (req, res) => {
  res.render("register");
});

// TODO: Crear u usar middleware de autorizacion
router.get(`/profile`, auth(['user', 'admin']), async (req, res) => {

  // console.log(doc);
  const doc = req.session?.user?._doc;
  const user = {
    firstName: doc?.first_name,
    lastName: doc?.last_name,
    email: doc?.email,
    age: doc?.age,
    role: doc?.role
  }
  // console.log(user);

  res.render("profile", {
    firstName: req.session?.user?.first_name || user.first_name,
    lastName: req.session?.user?.last_name || user.last_name,
    email: req.session?.user?.email || user.email,
    age: req.session?.user?.age || user.age,
    role: req.session?.user?.role || user.role
  });
  // res.render("profile", { user });
});


router.get("/products", auth(['admin']), async (req, res) => {
  const products = await getAllProducts()
  //console.log(products);
  res.render("products", { products });
})

module.exports = router;
