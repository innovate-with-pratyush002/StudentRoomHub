const express= require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const router= express.Router();
const Registration= require("../models/authentication.js");


//signup route
router.get("/signup",(req,res)=>{
    res.render("./userAuthentication/signup.ejs");
});

router.post("/",wrapAsync(async(req,res)=>{
    const newData = new Registration( req.body.place);
    await newData.save();
    req.flash("success","You Register Successfully!");
    res.redirect("/listings");
}));






module.exports=router;