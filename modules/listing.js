const mongoose= require("mongoose");
const {Schema}= mongoose;
const Review= require("./review.js");
const listingSchema= new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    image:{
       url: String,
       filename: String,
    },
    price:{
        type: Number,
        
    },
    location: {
        type: String,
    },
    country:{
        type: String,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
      type: {
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates:{
        type: [Number],
        reuired: true,
    },
},
    // category:{
    //     type: String,
    //     enum: ["mountains", "farms", "trending","beach", "rooms", "castles"]
    // }
});
//Mongoose middleware
listingSchema.post("findOneAndDelete", async(listing)=>{
   if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
}});
const Listing= mongoose.model("Listing", listingSchema);

module.exports = Listing;