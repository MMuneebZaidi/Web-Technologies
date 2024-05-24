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
    try {
        let company = await Company.findOne({ id: req.params.id });

        if (!company) {
            req.flash("danger", "Company doesn't exist");
            return res.status(404).send("Company doesn't exist");
        }

        Object.assign(company, req.body);

        await company.save();

        return res.send(company);
    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).send("Internal server error");
    }
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