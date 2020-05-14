import express from "express";

const router = express.Router();
router.get("/", function (req, res) {
    res.render("index", {
        userName: req.session?.userName ?? "Guest",
        isLogin: req.session?.registered,
        baseURL: "/weak",
    });
});
router.post("/register", function (req, res) {
    if (req.session) {
        req.session.userName = req.body.username;
        req.session.registered = true;
    }
    res.redirect("/weak");
});

router.post("/unregister", function (req, res) {
    if (req.session) {
        req.session.destroy(() => {
            console.log("destroy");
        });
    }
    res.send("You have unregistered!");
});
export { router as weakRouter };
