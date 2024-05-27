module.exports = async function (req, res, next) {
    res.flash = function (type, message) {
        req.session.flash = { type, message };
    };
    res.locals.flash = req.session.flash;
    req.session.flash = null;

    res.locals.user = req.session.user;
    next();
};