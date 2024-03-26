const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const session = require("express-session");
const displayRoutes = require("express-routemap");

// Internal imports
const viewsRoutes = require("./routes/views.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/carts.routes");
const prodRoutes = require("./routes/products.routes");
//const notesRoutes = require("./routes/notes.routes");
const initializePassport = require("./config/pasport.config");

const app = express();

const PORT = 3000;
const DB_HOST = "localhost";
const DB_PORT = 27017;
const DB_NAME = "entrega10";

const MONGO_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// TODO: add passport function with strategies
initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/authentication", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/carts/", cartRoutes);
app.use("/api/products/", prodRoutes);
app.use("/", viewsRoutes);

mongoose
    .connect(MONGO_URL)
    .then((con) => {
        console.log("🚀 ~ file: app.js:25 ~ mongoose.connect - OK");
    })
    .catch((err) => {
        console.log("🚀 ~ file: app.js:30 ~ err:", err);
    });

app.listen(PORT, () => {
    displayRoutes(app);
    console.log("🚀 ~ file: app.js:35 ~ app.listen ~ PORT:", PORT);
});
