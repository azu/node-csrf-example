import csrf from "csurf";
import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import { weakRouter } from "./weak-server";

const hbs = require("express-hbs");
// setup route middlewares
const csrfProtection = csrf({ cookie: false });
const app = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(session({ secret: "YkJG14aZdy4T", cookie: { maxAge: 60000 } }));

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
        userName: req.session?.userName ?? "Guest",
        isLogin: req.session?.registered,
        csrfToken: req.csrfToken(),
    });
});
app.post("/register", function (req, res) {
    if (req.session) {
        req.session.userName = req.body.username;
        req.session.registered = true;
    }
    res.redirect("/");
});

app.post("/unregister", csrfProtection, function (req, res) {
    if (req.session) {
        req.session.destroy(() => {
            console.log("destroy session");
        });
    }
    res.send("You have unregistered!");
});
// vulnerability version
app.use("/weak", weakRouter);
// Start server
const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
