const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: String,
        price: Number,
        location: String,
        state: String,
        reviews:[
          {
            type:Schema.Types.ObjectId,
            ref:"Review"
          }  
        ]
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports =Listing;