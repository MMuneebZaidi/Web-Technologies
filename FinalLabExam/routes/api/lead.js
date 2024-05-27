const express = require("express");
const { uuid } = require('uuidv4');
let router = express.Router();
let Profile = require("../../models/profile");
let Lead = require("../../models/lead");

router.get("/leads/:id?/:page?", async (req, res) => {
    if(!req.params.id){
        res.render("auth/register");
    }

    let page = Number(req.params.page) ? Number(req.params.page) : 1;
    let pageSize = 10;
    let leads = await Lead.find({profileId: req.params.id})
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    let profile = await Profile.findOne({ id: req.params.id });

    if(!leads){
        return res.send( "No Leads found");
    }

    if(!profile){
        res.flash("danger", "Profile doesnt exist");
    }

    let total = await Lead.find({profileId: req.params.id}).countDocuments();
    let totalPages = Math.ceil(total / pageSize);

    let leadData = {
        profile,
        leads,
        total,
        page,
        pageSize,
        totalPages,
    }

    return res.send(leadData);

});


router.post("/leads", async (req, res) => {

    let profile = await Profile.findOne({ id: req.body.profileId });

    if (!profile) {
        res.flash("danger", "Profile does not exist");
        // return res.redirect("/profile");
    }

    let leadData = {
        id: uuid(),
        profileId: profile.id,
        companyId: profile.companyId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: profile.company,
    }

    let lead = await Lead(leadData);
    await lead.save();

    profile.leads = profile.leads + 1;
    await profile.save();

    res.send(lead);

});

module.exports = router;