const express = require("express");
const { uuid } = require('uuidv4');
let router = express.Router();
let Profile = require("../../models/profile");
let Company = require("../../models/company");
var fs = require('fs');
var path = require('path');
const multer = require("multer");
const generateUsername = require("../../helpers/usernameGenerator");
const checkSessionAuth = require("../../middleware/sessionauth");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'routes/site/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]);

router.get("/profile/:username", async (req, res) => {
    console.log("Profile id:", req.params);
    let profileData = await Profile.findOne({username: req.params.username});

    if(!profileData){
        res.flash("danger", "Profile doesnt exist");
    }

    let company = await Company.findOne({id: profileData.companyId});

    if(!company){
        res.flash("danger", "Company doesnt exist");
    }

    let profile= {
        id : profileData.id,
        name : profileData.name,
        email : profileData.email,
        phone : profileData.phone,
        instagram : profileData.instagram,
        linkedIn : profileData.linkedIn,
        twitter : profileData.twitter,
        jobTitle : profileData.jobTitle,
        company : company,
        leads : profileData.leads,
        image : profileData.image,
        cover : profileData.cover,
        username : profileData.username,
        address : profileData.address
    }

    res.render("site/digitalProfile", {profile: profile , page: 'digitalProfile'} );
});

router.use(checkSessionAuth);

router.get("/profile", async (req, res) => {
    let profileData = await Profile.findOne({id: req.session.profileData.id});

    if (!profileData) {
        res.flash("danger", "Profile doesnt exist");
    }

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


    res.render("site/profile", {page: 'profile', profile: profile , profileData: req.session.profileData , edit: true});
});

router.post("/profile", upload ,async (req, res) => {

    let profile = await Profile.findOne({ email: req.body.email });

    if (profile) {
        res.flash("danger", "Profile with this email already exist");
        return res.redirect("/profile");
    }


    const username = generateUsername(req.body.name);

    let company = await Company.findOne({ id: req.session.profileData.companyId });

    if (company) {
        let id = uuid();
        let profileData = {
            id: id,
            userId: id,
            name: req.body.name,
            email: req.body.email,
            companyId: company.id,
            username: username,
        }


        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('Default', saltRounds);

        let userData= {
            id: profileData.id,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        };

        user = new User(userData);
        await user.save();

        Object.assign(profileData, req.body);

        if(req.files.image) {
            let image = req.files.image[0];
            let imageName = image.filename;
            profileData.image = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + imageName)),
                contentType: 'image/png'
            };
        }
        if(req.files.cover) {
            let cover = req.files.cover[0];
            let coverName = cover.filename;
            profileData.cover = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + coverName)),
                contentType: 'image/png'
            };
        }

        let profile = await Profile(profileData);

        await profile.save();
    }

    return res.redirect("/crew");
});

router.post("/profile/:id",upload, async (req, res) => {

    try {
        let profile = await Profile.findOne({ id: req.params.id });

        if (!profile) {
            req.flash("danger", "Profile doesn't exist");
            return res.status(404).send("Profile doesn't exist");
        }

        let data = req.body;

        if(req.files.image) {
            let image = req.files.image[0];
            let imageName = image.filename;
            data.image = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + imageName)),
                contentType: 'image/png'
            };
        }
        if(req.files.cover) {
            let cover = req.files.cover[0];
            let coverName = cover.filename;
            data.cover = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + coverName)),
                contentType: 'image/png'
            };
        }

        Object.assign(profile, data);

        if(req.session.profileData.id === profile.id){
            req.session.profileData = profile;
        }

        await profile.save();

        return res.redirect(`/crew/profile/${profile.id}`);
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).send("Internal server error");
    }
});

router.delete("/profile/:id", async (req, res) => {
    try {
        let profile = await Profile.findOne({ id: req.params.id });
        if (!profile) {
            req.flash("danger", "Profile doesn't exist");
            return res.redirect("/crew");
        }
        await User.deleteOne({id: profile.userId});
        await Profile.deleteOne({ id: req.params.id });
        return res.send({
            message : 'deleted'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



module.exports = router;