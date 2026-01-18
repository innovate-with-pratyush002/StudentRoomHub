const Listing= require("../models/listing.js");
const CurrentUser= require("../models/authentication.js");

//Profile route:=>
module.exports.userProfile = async (req, res) => {
    let User_id  = res.locals.currentUser.id;
    const UserData = await CurrentUser.findById(User_id);
    const allListings = await Listing.find({ user: User_id })
      .populate({ path: "reviews", populate: { path: "user" } })
      .populate("user");
    


    if (!UserData) {
        req.flash("error", "User does not exist!");
        res.redirect("/listings");
    }
    res.render("./userAuthentication/userProfile.ejs", { UserData, allListings});
 }
