const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
const path = require("path");
const methodOverride= require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


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

// MAI BAS TUMHARE BURE VAKT KA EK SAHARA THA, YE GALAT FAHMI THI MUJHE KI MAI TUMHARA THA.
// NIND TO USS DIN TUTI HAMARI JAB TERE ISHQ KE PANNE PAR NAAA KAHI JIKRA HAMARA THA.
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

// NAA KISI KE SAATH KI UMMID, NAA HI KISI KA SAHAANA CHAHIE.
// HAM THE ISS SAFAR ME AKELE AB HAME NAA SAATH TUMHARA CHAHIE. 
app.delete("/listings/:id",async(req,res)=>{
      let{id}=req.params;
      await Listing.findByIdAndDelete(id);
      res.redirect("/listings");
});


//detail route:=>

// TERE AANKHO KI JO BAAT HAI, VO LAFJO ME KAHA AATI HAI.
// INME CHHIPE HAI RAAJ KAYI,JAISE CHAND KI PARCHHYI HAI.
// NAJRE JHUKI TO HYA LAGE, UTHE TO KAYAMAT LAAYI HAI.
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const Data= await Listing.findById(id);
    res.render("./listings/detail.ejs",{ Data });
});




