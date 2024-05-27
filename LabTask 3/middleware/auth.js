async function sessionAuth(req, res, next) {
    res.locals.user = req.session.user;

    req.flash = function (type, message) {
        req.session.flash = { type, message };
    };
    if (req.session.flash) {
        res.locals.flash = req.session.flash;
        req.session.flash = null;
    }
    next();
}

module.exports = sessionAuth;