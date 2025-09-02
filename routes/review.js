const express= require("express");
const Listing= require("../models/listing.js")
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Review= require("../models/review.js");
const router= express.Router({mergeParams: true});
const {isLoggedIn, isReviewOwner} = require("../middleware.js");



//review route
router.post("/",isLoggedIn,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.owner= req.user._id;
    listing.reviews.push(newReview); 
    await newReview.save();
    await listing.save();
        req.flash("success","New Review Added!");
    res.redirect(`/listings/${listing.id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review is Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;