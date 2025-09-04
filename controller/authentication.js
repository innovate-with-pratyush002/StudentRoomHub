const Listing= require("../models/listing.js");
const Registration= require("../models/authentication.js");


//signup route
module.exports.signUpForm=(req,res)=>{
    res.render("./userAuthentication/signup.ejs");
}

module.exports.Signup=async(req,res)=>{
   try{
    const{name,email,username,password}=req.body;
    const newUser = new Registration({name,email,username});
    const registeredUser= await Registration.register(newUser, password);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success",`Welcome ${req.body.name}`);
        res.redirect("/listings");
    });
    req.flash("success","You Have Registered Successfully!");
   }catch(e){
      req.flash("error",e.message);
        res.redirect("/signup");
   }
}

//signin route
module.exports.signinForm=(req,res)=>{
    res.render("./userAuthentication/signin.ejs");
}

module.exports.SignIn=async(req,res)=>{
  req.flash("success","Sign-In Successfully!");
  res.redirect("/listings");
}

//logout
module.exports.logout=(req, res) => {
    req.logout(() => {
        res.redirect('/signin');
    });
}