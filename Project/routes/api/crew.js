const express = require("express");
const { uuid } = require('uuidv4');
let router = express.Router();
let Profile = require("../../models/profile");
let Lead = require("../../models/lead");
const Company = require("../../models/company");
const checkSessionAuth = require("../../middleware/sessionauth");

router.use(checkSessionAuth);

router.get("/crew/add-member", async (req, res) => {
    let profile = {
        id: '',
        name: "",
        email: "",
        phone: "",
        instagram: "",
        linkedIn: "",
        twitter: "",
        jobTitle: "",
        company: "",
        leads: '',
        image: "",
        cover: "",
        username: "",
        address: ""
    }
    res.render("site/profile", {page: 'crew',profile: profile, profileData: req.session.profileData, edit: false});
});

router.get("/crew/:page?", async (req, res) => {

    let page = Number(req.params.page) ? Number(req.params.page) : 1;
    let pageSize = 10;
    let members = await Profile.find({companyId: req.session.profileData.companyId})
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    if(!members){
        res.flash("danger", "No Crew member found");
        return res.redirect("/crew/add-member");
    }


    let total = await Profile.find({companyId: req.session.profileData.companyId}).countDocuments();
    let totalPages = Math.ceil(total / pageSize);
    if(totalPages < 1){
        totalPages = 1;
    }

    let crew = {
        members,
        total,
        page,
        pageSize,
        totalPages,
    }
    console.log("user", req.session.user);

    console.log("Admin", req.session.profileData);

    return res.render("site/crew", {crew: crew, page: "crew", profileData: req.session.profileData});

});



router.get("/crew/profile/:id", async (req, res) => {
    let profileData = await Profile.findOne({id: req.params.id});

    if (!profileData) {
        res.flash("danger", "Profile doesnt exist");
    }

    console.log(profileData);
    let company = await Company.findOne({id: profileData.companyId});

    if (!company) {
        res.flash("danger", "Company doesnt exist");
    }

    let profile = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        instagram: profileData.instagram,
        linkedIn: profileData.linkedIn,
        twitter: profileData.twitter,
        jobTitle: profileData.jobTitle,
        company: company,
        leads: profileData.leads,
        image: profileData.image,
        cover: profileData.cover,
        username: profileData.username,
        address: profileData.address
    }


    res.render("site/profile", {page: 'crew', profile: profile , profileData: req.session.profileData , edit: true});
});

module.exports = router;