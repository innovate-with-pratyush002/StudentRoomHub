const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended: true}));


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

app.get("/",(req,res)=>{
    res.send("responce is sending successfully:");
});

// app.get("/testing",async(req,res)=>{
//     let sample= new Listing({
//         title: "room at khandari",
//         description: "room with combined kitchen",
//         price: 8000,
//         location:"khandari",
//         state:"uttaar pradesh"
//     });
//     await sample.save();
//     console.log("sample is saved");
//     res.send("successful testing");
// })

//route for showing all listings
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/listing.ejs",{ allListings });
});

//add route where we can add a new listing 
app.get("/listings/new",(req,res)=>{
    res.render("listings/addListing.ejs");
});

app.post("/listings",async(req,res)=>{
    const newData = new Listing( req.body.place);
    await newData.save();
    res.redirect("/listings");
});

//detail route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id);
    res.render("./listings/detail.ejs",{ Data });
});




