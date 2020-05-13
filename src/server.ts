import csrf from "csurf";
import bodyParser from "body-parser";
import express from "express";
import session from "express-session";

const hbs = require("express-hbs");
// setup route middlewares
const csrfProtection = csrf({ cookie: false });
const parseForm = bodyParser.urlencoded({ extended: false });
const app = express();
app.use(session({ secret: "YkJG14aZdy4T", cookie: { maxAge: 60000 } }));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine(
    "hbs",
    hbs.express4({
        partialsDir: __dirname + "/views/partials",
    })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.get("/", csrfProtection, function (req, res) {
    res.render("index", {
        userName: "Guest",
        isLogin: req.session?.registered,
        csrfToken: req.csrfToken(),
    });
});
app.post("/register", parseForm, function (req, res) {
    if (req.session) {
        req.session.userName = req.body.username;
        req.session.registered = true;
    }
    res.redirect("/");
});

app.post("/unregister", parseForm, csrfProtection, function (req, res) {
    if (req.session) {
        delete req.session.userName;
        delete req.session.registered;
    }
    res.send("You have unregistered!");
});

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
