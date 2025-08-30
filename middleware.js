const Listing= require("./models/listing.js");


module.exports.isLoggedIn=(req, res, next)=> {
    if (req.isAuthenticated()) return next();
    res.redirect('/signin');
};

module.exports.isUser=async(req,res,next)=>{
      let{id}=req.params;
      let listing= await Listing.findById(id);
      if(!listing.user._id.equals(res.locals.currentUser._id)){
         req.flash("error","You are not the Owner!");
         return res.redirect(`/listings/${id}`);
      }
      next();
}