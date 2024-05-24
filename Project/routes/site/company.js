const express = require("express");
let router = express.Router();
let Company = require("../../models/company");

router.get("/company/:id", (req, res) => {
    res.render("auth/register");
});

router.get("/company", (req, res) => {
    res.render("auth/register");
});


router.patch("/company/:id", async (req, res) => {

    let company = await Company.findOne({id: req.params.id});
    if(!company){
        res.flash("danger", "Profile doesnt exist");
    }

    company.name = req.body.name;
    company.phone = req.body.phone;
    company.instagram = req.body.instagram;
    company.linkedIn = req.body.linkedIn;
    company.twitter = req.body.twitter;
    company.industry = req.body.industry;

    await company.save();
    return res.send(company);
});

router.delete("/company/:id", async (req, res) => {
    let company = await Company.findOne({id: req.params.id});
    if(!company){
        res.flash("danger", "Profile doesnt exist");
    }
    await company.delete();
    return res.send(company);
});

module.exports = router;