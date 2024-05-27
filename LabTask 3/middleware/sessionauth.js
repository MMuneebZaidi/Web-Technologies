async function checkSessionAuth(req, res, next) {
    if (!req.session.user) {
        res.flash("danger", "You need to login for this route");
        return res.redirect("/login");
    }
    next();
}

module.exports = checkSessionAuth;