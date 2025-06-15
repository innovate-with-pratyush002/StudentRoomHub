const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");

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
app.get("/",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/home.ejs",{allListings});
});


//route for showing all listings:=>
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/listing.ejs",{ allListings });
});

//add route where we can add a new listing:=> 
app.get("/listings/new",(req,res)=>{
    res.render("listings/addListing.ejs");
});

app.post("/listings",async(req,res)=>{
    const newData = new Listing( req.body.place);
    await newData.save();
    res.redirect("/listings");
});


//edit & update route:=>
app.get("/listings/:id/edit",async(req,res)=>{
     let {id}=req.params;
    const Data= await Listing.findById(id);
    res.render("./listings/edit.ejs",{ Data });
});
app.put("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.place});
    res.redirect(`/listings/${id}`);
});


//delete route:=>
app.delete("/listings/:id",async(req,res)=>{
      let{id}=req.params;
      await Listing.findByIdAndDelete(id);
      res.redirect("/listings");
});


//detail route:=>
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id);
    res.render("./listings/detail.ejs",{ Data });
});

// MAI BAS TUMHARE BURE VAKT KA EK SAHARA THA, YE GALAT FAHMI THI MUJHE KI MAI TUMHARA THA.
// NIND TO USS DIN TUTI HAMARI JAB TERE ISHQ KE PANNE PAR NAAA KAHI JIKRA HAMARA THA.




