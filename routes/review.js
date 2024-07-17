const express= require("express");
const router= express.Router({ mergeParams : true });
const wrapAsync= require("../utils/wrapasync.js");
const ExpressErr= require("../utils/expresserr.js");
const {reviewSchema}= require("../schema.js");
const Listing= require("../modules/listing.js")
const Review = require("../modules/listing.js");

const validateReview = (req, res, next)=>{
    let {error}= reviewSchema.validate(req.body);
  
    if(error){
        let errmsg= error.details.map( (el)=> el.message ).join(",");
        throw new ExpressErr(400, errmsg);
    }
    else{
        next();
    }
}
//REVIEWS
//POST ROUTE
router.post("/", validateReview, wrapAsync(async (req, res)=>{
    let {id}= req.params;
    
   let listing = await Listing.findById(id);
   let newReview= new Review(req.body.review);
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW
router.delete("/:rid",wrapAsync( async(req, res)=>{
    let {id, rid}= req.params;
   await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});
   
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${id}`);
}));

module.exports= router;

