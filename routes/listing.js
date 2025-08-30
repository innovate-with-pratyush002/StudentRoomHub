const express= require("express");
const Listing= require("../models/listing.js")
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const router= express.Router();
const {isLoggedIn} = require("../middleware.js");


//route for showing all listings:=>
router.get("/",isLoggedIn,wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/listing.ejs",{ allListings });       
}));


//add route where we can add a new listing:=> 
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/addListing.ejs");
});                                                            

router.post("/",wrapAsync(async(req,res)=>{
    const newData = new Listing( req.body.place);
    newData.user = req.user._id; 
    await newData.save();
    req.flash("success","New location added successfully!");
    res.redirect("/listings");
}));


//edit & update route:=>
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
     let {id}=req.params;
    const Data= await Listing.findById(id);
     if(!Data){
        req.flash("error","listing does not exist!");
        res.redirect("/listings"); 
    }
    res.render("./listings/edit.ejs",{ Data });
}));
router.put("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.place});
        req.flash("success","Location Detail Edited!");
    res.redirect(`/listings/${id}`);
}));


//delete route:=>
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
      let{id}=req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success","Listing is Deleted!");
      res.redirect("/listings");
}));


//detail route:=>
router.get("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id).populate("reviews").populate("user");
     if(!Data){
        req.flash("error","listing does not exist!");
        res.redirect("/listings"); 
    }
    res.render("./listings/detail.ejs",{ Data });
}));




module.exports=router;
