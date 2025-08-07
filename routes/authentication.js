const express= require("express");
const wrapAsync= require("../utils/wrapAsync.js");
const router= express.Router();
const Registration= require("../models/authentication.js");
const passport= require("passport");


//signup route
router.get("/signup",(req,res)=>{
    res.render("./userAuthentication/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
   try{
    const{name,email,username,password}=req.body;
    const newUser = new Registration({name,email,username});
    await Registration.register(newUser, password);
    req.flash("success","You Have Registered Successfully!");
    res.redirect("/listings");
   }catch(e){
      req.flash("error",e.message);
        res.redirect("/signup");
   }
}));




// google authentication

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin' }),
    (req, res) => {
        res.redirect('/listings');
    }
);





//signin route
router.get("/signin",(req,res)=>{
    res.render("./userAuthentication/signin.ejs");
});

router.post("/signin", passport.authenticate("local", { failureRedirect: '/signin',failureFlash:true }),wrapAsync(async(req,res)=>{
  req.flash("success","Sign-In Successfully!");
  res.redirect("/listings");
}));


//logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/signin');
    });
});

module.exports=router;