const express = require("express");
const { uuid } = require('uuidv4');
let router = express.Router();
let Profile = require("../../models/profile");
let Company = require("../../models/company");

router.get("/profile/:id", async (req, res) => {
    let profile = await Profile.findOne({id: req.params.id});

    if(!profile){
        res.flash("danger", "Profile doesnt exist");
    }

    let company = await Company.findOne({id: profile.companyId});

    if(!company){
        res.flash("danger", "Company doesnt exist");
    }

    let profileData = {
        id : profile.id,
        name : profile.name,
        email : profile.email,
        phone : profile.phone,
        instagram : profile.instagram,
        linkedIn : profile.linkedIn,
        twitter : profile.twitter,
        jobTitle : profile.jobTitle,
        company : company,
        leads : profile.leads
    }

    res.render("auth/register", profileData );
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
    try {
        let profile = await Profile.findOne({ id: req.params.id });

        if (!profile) {
            req.flash("danger", "Profile doesn't exist");
            return res.status(404).send("Profile doesn't exist");
        }

        Object.assign(profile, req.body);

        await profile.save();

        return res.send(profile);
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).send("Internal server error");
    }
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