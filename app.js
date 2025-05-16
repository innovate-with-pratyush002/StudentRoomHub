const express= require("express");
const app= express();
const mongoose = require("mongoose");


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