const express = require("express");
const { uuid } = require('uuidv4');
let router = express.Router();
let Profile = require("../../models/profile");
let Company = require("../../models/company");

router.get("/profile/:id", (req, res) => {
    res.render("auth/register");
});

router.get("/profile", (req, res) => {
    res.render("auth/register");
});

router.post("/profile", async (req, res) => {

    let profile = await Profile.findOne({ email: req.body.email });

    if (profile) {
        res.flash("danger", "Profile with this email already exist");
        // return res.redirect("/profile");
    }

    let company = await Company.findOne({ id: req.body.companyId });

    if (company) {
        let profileData = {
            id: uuid(),
            userId: profile.id,
            name: req.body.name,
            email: req.body.email,
            companyId: company.id,
        }
        let profile = await Profile(profileData);
        await profile.save();
    }

    // res.render("/login");
});

router.patch("/profile/:id", async (req, res) => {

    let profile = await Profile.findOne({id: req.params.id});
    if(!profile){
        res.flash("danger", "Profile doesnt exist");
    }

    profile.name = req.body.name;
    profile.phone = req.body.phone;
    profile.instagram = req.body.instagram;
    profile.linkedIn = req.body.linkedIn;
    profile.twitter = req.body.twitter;
    profile.jobTitle = req.body.jobTitle;

    await profile.save();
    return res.send(profile);
});

router.delete("/profile/:id", async (req, res) => {
    let profile = await Profile.findOne({id: req.params.id});
    if(!profile){
        res.flash("danger", "Profile doesnt exist");
    }
    await profile.delete();
    return res.send(profile);
});

module.exports = router;