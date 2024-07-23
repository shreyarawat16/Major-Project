const Review= require("../modules/review.js");
const Listing= require("../modules/listing.js");
module.exports.createReview= async (req, res)=>{
    let {id}= req.params;
    
   let listing = await Listing.findById(id);
   let newReview= new Review(req.body.review);
   newReview.author= req.user._id; //storing the author of new review
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("success", "Review added successfully");
   res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=  async(req, res)=>{
    let {id, rid}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid}});
    
   let del= await Review.findByIdAndDelete(rid);
console.log(del);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
};