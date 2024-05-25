const express = require("express");
const { uuid } = require('uuidv4');
const bcrypt = require("bcrypt");
let router = express.Router();
let User = require("../../models/user");
let Profile = require("../../models/profile");
let Company = require("../../models/company");
let Contact = require("../../models/contacts");


router.get("/register", (req, res) => {
    res.render('site/register', {
        page: 'register',
        isMobile: false,
        hamburger: false,
        emailError: '',
        errorMessage: '',
        showPassword: false,
        otpOption: true,
        loader: false

    });

});

router.post("/register", async (req, res) => {

    let user = await User.findOne({ email: req.body.email });

    if (user) {
        res.flash("danger", "User with this email already exist");
        return res.redirect("/register");
    }

    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        return null;
    };

    if(validatePassword(req.body.password)){
        res.flash("danger", validatePassword(req.body.password));
        return res.redirect("/register");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    let userData= req.body;
    userData.id = uuid();
    userData.password = hashedPassword;
    user = new User(userData);
    await user.save();

    let profileData = {
        id: uuid(),
        userId: user.id,
        name: user.name,
        email: user.email,
        leads : 0
    }

    let companyData = {
        id: uuid(),
        userId: user.id,
        name: user.name,
        email: user.email,
        profileID : profileData.id,
    }

    profileData.companyId = companyData.id;

    let profile = await Profile(profileData);
    await profile.save();

    let company = await Company(companyData);
    await company.save();

    res.render("/login");
});

router.get("/logout", (req, res) => {
    req.session.user = null;
    res.flash("success", "Logged out Successfully");
    res.redirect("/login");
});

router.get("/login", (req, res) => {
    res.render('site/login', {
        page: 'login',
        isMobile: false,
        hamburger: false,
        emailError: '',
        errorMessage: '',
        showPassword: false,
        otpOption: true,
        loader: false
    });
});


router.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.flash("danger", "User with given email doesn't exist");
        return res.redirect("/register");
    }
    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
        res.flash("danger", "Invalid Password");
        return res.redirect("/login");
    }

    req.session.user = user;
    res.flash("success", user.name + " Logged In");
    return res.redirect("/");
});

router.get("/contacts", async (req, res) => {
    let contacts = await Contact.find();
    return res.send(contacts);
});

router.post("/contacts", async (req, res) => {
    let contactData= req.body;
    contactData.id = uuid();
    let contact = await Contact(contactData);
    await contact.save();
    res.flash("danger", "Form submitted successfully");
    return res.redirect("/");
});

module.exports = router;