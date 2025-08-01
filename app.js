const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js")
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const listingsRoute= require("./routes/listing.js");
const reviewRoute= require("./routes/review.js");
const authenticationRoute= require("./routes/authentication.js");
const session= require("express-session");
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy= require("passport-local");
const userAuth=require("./models/authentication.js");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



//Session 
const sessionDetail={
    secret:"who is tukku?",
    resave: false,
    saveUninitialized: true,

    cookie:{
        expires: Date.now()+5*24*60*60*1000,
        maxAge:5*24*60*60*1000,
        httpOnly: true
    }
};
app.use(session(sessionDetail));
app.use(flash());



//Passport for Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userAuth.authenticate()));

passport.serializeUser(userAuth.serializeUser());
passport.deserializeUser(userAuth.deserializeUser());



//mongoose Connection
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

// app.get("/check",async(req,res)=>{
//     const userdetail= new userAuth({
//         name:"pratyush",
//         email:"pratyush1532@gmail.com",
//         username:"pratyush_1532"
//     });
//     let newUser= await userAuth.register(userdetail,"123@pttt");
//     res.send(newUser);
// });

//middleware for flash message
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

//Routes
app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",authenticationRoute);


// app.all("*",(req,res,next)=>{
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




