const express= require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const router= express.Router();
const Registration= require("../models/authentication.js");
const passport= require("passport");


//signup route
router.get("/signup",(req,res)=>{
    res.render("./userAuthentication/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
   try{
     const newData = new Registration( req.body.place);
    const password = req.body.place.password;
    await Registration.register(newData, password);
    req.flash("success","You Have Registered Successfully!");
    res.redirect("/listings");
   }catch(e){
      req.flash("error",e.message);
        res.redirect("/signup");
   }
}));


//signin route
router.get("/signin",(req,res)=>{
    res.render("./userAuthentication/signin.ejs");
});

router.post("/signin", passport.authenticate("local", { failureRedirect: '/signin',failureFlash:true }),wrapAsync(async(req,res)=>{
  req.flash("success","Sign-In Successfully!");
  res.redirect("/listings");
}));






module.exports=router;