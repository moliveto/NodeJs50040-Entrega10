function authMdw(req, res, next) {
  console.log("****AUTH MDW*********");
  if (req.session?.user) {
    return next();
  }

  return res.redirect("/login");
}

function auth(allowedRoles) {
  console.log("****AUTH *********");
  return (req, res, next) => {


    if (!req.session.user) {
      return res.status(401).send("No autorizado");
    }

    // const userRole = req.session.user._doc.role;
    const userRole = req.session.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).send("Acceso denegado");
    }

    next();
  };
}

module.exports = { authMdw, auth };
