const express= require("express");
const Listing= require("../models/listing.js")
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const router= express.Router();


//route for showing all listings:=>
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/listing.ejs",{ allListings });
}));

//add route where we can add a new listing:=> 
router.get("/new",(req,res)=>{
    res.render("listings/addListing.ejs");
});

router.post("/",wrapAsync(async(req,res)=>{
    const newData = new Listing( req.body.place);
    await newData.save();
    res.redirect("/listings");
}));


//edit & update route:=>
router.get("/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    const Data= await Listing.findById(id);
    res.render("./listings/edit.ejs",{ Data });
}));
router.put("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.place});
    res.redirect(`/listings/${id}`);
}));


//delete route:=>
router.delete("/:id",wrapAsync(async(req,res)=>{
      let{id}=req.params;
      await Listing.findByIdAndDelete(id);
      res.redirect("/listings");
}));


//detail route:=>
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id).populate("reviews");
    res.render("./listings/detail.ejs",{ Data });
}));

module.exports=router;
