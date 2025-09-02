const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const UserAuth =require("./authentication.js");


const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    owner:{
          type:Schema.Types.ObjectId,
          ref:"UserAuth",
          required: true
        } 
});
const Review=mongoose.model("Review",reviewSchema);
module.exports =Review;