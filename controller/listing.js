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
    const lat = parseFloat(req.body.place.lat);
    const lon = parseFloat(req.body.place.lon);
    let url=req.file.path;
    let fileName= req.file.filename;
    const newData = new Listing( req.body.place);
    newData.user = req.user._id;
    newData.image={url,fileName}; 
    if (isNaN(lat) || isNaN(lon)) {
    req.flash("error", "Please select a location on the map.");
    return res.redirect("/listings/new");
    }
    else{
       newData.mapCoordinates={
         type: "Point",
         coordinates: [lon,lat] 
        }
    }
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
   let updatedListing= await Listing.findByIdAndUpdate(id,{...req.body.place});
   if(typeof req.file !=="undefined"){
     let url=req.file.path;
     let fileName= req.file.filename;
     updatedListing.image={url,fileName}; 
     await updatedListing.save();
   }
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
module.exports.listingDetails=async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id).populate({path:"reviews",populate: {path:"owner"}}).populate("user");
    
     if(!Data){
        req.flash("error","listing does not exist!");
        res.redirect("/listings"); 
    }
    res.render("./listings/detail.ejs",{ Data });
}
