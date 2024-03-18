const { Router } = require("express");

const handlePolicies = require("../middleware/handle-policies.middleware");
const { userModel, getAllUsers } = require("../model/user.model");

const router = Router();

router.get("/", handlePolicies(["public"]), async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: `Error al obtener los usuarios ${error}` });
  }
});

router.get("/:userId", handlePolicies(["user", "admin"]), async (req, res) => {
  try {
    // TODO: VALIDAR EL ID DE LOS PARAMETROS, Q TENGA LA FORMA DE UN ID EN MONGOOSE

    const userData = await userModel.findById({ _id: req.params.userId });

    if (!userData) {
      return res.status(404).json({ message: `getUserById empty` });
    }
    return res.json({ message: `getUserById`, user: userData });
  } catch (error) {
    console.log("🚀 ~ file: user.routes.js:16 ~ router.get ~ error:", error);
  }
});

// ADD Note to an user, se podria quitar el parametro userId (pensarlo y probarlo)
router.post(
  "/:userId/notes/:noteId",
  handlePolicies(["user", "admin"]),
  async (req, res) => {
    try {
      const { noteId, userId } = req.params;
      // si el userId tiene algun problema se le atribuira la nota al usuario con la session actual
      const userData = await userModel.findById({ _id: userId || req.user.id });

      userData.notes.push({ note: noteId });

      const updateUser = await userModel.updateOne(
        { _id: userId || req.user.id },
        userData
      );
      return res.json({
        message: `getUserById for user role`,
        user: updateUser,
      });
    } catch (error) {
      console.log("🚀 ~ file: user.routes.js:46 ~ error:", error);
    }
  }
);

// TODO: Hacer update del usuario (sin actualizar el password)

router.delete("/:userId", handlePolicies(["admin"]), async (req, res) => {
  console.log(
    "🚀 ~ file: user.routes.js:36 ~ aqui solo entra el admin",
    req.user
  );
  try {
    const deleteUser = await userModel.deleteOne({ _id: req.params.userId });
    return res.json({
      message: `deleteUserById with ROLE admin`,
      user: deleteUser,
    });
  } catch (error) {
    console.log("🚀 ~ file: user.routes.js:47 ~ router.delete ~ error:", error);
  }
});

module.exports = router;
