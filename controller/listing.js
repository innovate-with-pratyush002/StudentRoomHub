const Listing= require("../models/listing");

//route for showing all listings:=>
module.exports.showAllListings= async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/listing.ejs",{ allListings });       
}

//add route where we can add a new listing:=> 
module.exports.showform=(req,res)=>{
    res.render("listings/addListing.ejs");
}

module.exports.addListing=async(req,res)=>{
    const newData = new Listing( req.body.place);
    newData.user = req.user._id; 
    await newData.save();
    req.flash("success","New location added successfully!");
    res.redirect("/listings");
}

//edit & update route:=>
module.exports.findForUpdate=async(req,res)=>{
     let {id}=req.params;
    const Data= await Listing.findById(id);
     if(!Data){
        req.flash("error","listing does not exist!");
        res.redirect("/listings"); 
    }
    res.render("./listings/edit.ejs",{ Data });
}

module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.place});
        req.flash("success","Location Detail Edited!");
    res.redirect(`/listings/${id}`);
}

//delete route:=>
module.exports.deleteListing=async(req,res)=>{
      let{id}=req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success","Listing is Deleted!");
      res.redirect("/listings");
}

//detail route:=>
module,exports.listingDetails=async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id).populate({path:"reviews",populate: {path:"owner"}}).populate("user");
     if(!Data){
        req.flash("error","listing does not exist!");
        res.redirect("/listings"); 
    }
    res.render("./listings/detail.ejs",{ Data });
}
