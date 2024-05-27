const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const isAuthenticated = require("./middlewares/isAuthenticated");
require('dotenv').config();

var bodyParser = require('body-parser');


mongoose.connect(process.env.DATABASE).then((data) => {
    console.log("DB Connected");
});

let server = express();
server.use(express.static("public"));
server.set("view engine", "ejs");
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json());

server.use(cookieParser());

server.use(session({
    secret: process.env.SESSIONSECRET,
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
}));

server.use(require("./middleware/flashmiddleware"));
var expressLayouts = require("express-ejs-layouts");
server.use(expressLayouts);

server.get("/", (req, res) => {
    const page = 'home';
    const hamburger = true;
    const isMobile = false;
    res.render("site/homepage",{page, hamburger, isMobile});
});

server.use("/", require("./routes/site/auth"));
server.use("/", require("./routes/site/company"));
server.use("/", require("./routes/site/profile"));
server.use("/", require("./routes/api/crew"));



server.listen(process.env.PORT, () => {
    console.log("Server started at localhost:4000");
});