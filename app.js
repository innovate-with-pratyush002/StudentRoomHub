const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const Review= require("./models/review.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const MONGO_URL="mongodb://127.0.0.1:27017/RoomForU";
main()
      .then(()=>{
        console.log("connected to DB");
       })
       .catch((err)=>{
        console.log(err);
       });

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.listen(3000,()=>{
    console.log("app is listening");
});


//home route
app.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/home.ejs",{allListings});
}));


//route for showing all listings:=>
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/listing.ejs",{ allListings });
}));

//add route where we can add a new listing:=> 
app.get("/listings/new",(req,res)=>{
    res.render("listings/addListing.ejs");
});

app.post("/listings",wrapAsync(async(req,res)=>{
    const newData = new Listing( req.body.place);
    await newData.save();
    res.redirect("/listings");
}));


//edit & update route:=>
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    const Data= await Listing.findById(id);
    res.render("./listings/edit.ejs",{ Data });
}));
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.place});
    res.redirect(`/listings/${id}`);
}));


//delete route:=>
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
      let{id}=req.params;
      await Listing.findByIdAndDelete(id);
      res.redirect("/listings");
}));


//detail route:=>
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id);
    res.render("./listings/detail.ejs",{ Data });
}));

//review route
app.post("/listings/:id/reviews",async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
});


// app.get("*",(req,res,next)=>{
// res.send("somethink went wrong");
// });


// middleware for error handling
app.use((err,req,res,next)=>{
    let{status=500,message="Something Went Wrong!"}=err;
    res.status(status).send(message); 
});


















// TERI AANKHO KI SHOKHI ME KOYI RAAJ TO HOGA,
// BINA KAHE HI SAB KUCHH KAH JANA ANDAAJ TO HOGA.
// JHEEL SI GAHRAI, CHAND SI ROSHANI HAI INME,
// INN NIGAAHO ME CHHUPA KOYI SAAJ TO HOGA.
// JAB BHI DEKHU KHUD KO KHOYA PATA HU,
// INN AANKHO ME KOYI MERA AAJ TO HOGA.




