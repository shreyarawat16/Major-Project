 const Listing= require("./modules/listing.js");
const ExpressErr= require("./utils/expresserr.js");
const Review= require("./modules/review.js");
const {listingSchema, reviewSchema}= require("./schema.js");

 module.exports.isLoggedIn=   (req, res, next)=>{
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        //redirectUrl save
        req.session.redirectUrl= req.originalUrl; 
        req.flash("error", "you must be logged in to create listing");
       return res.redirect("/login");
    }
    else{
        next();
    }
}

module.exports.validateListing = (req, res, next)=>{

    let {error}= listingSchema.validate(req.body);
  
    if(error){
        let errmsg= error.details.map( (el)=> el.message ).join(",");
        throw new ExpressErr(400, errmsg);
    }
    else{
        next();
    }
}

module.exports.validateEditListing = (req, res, next)=>{

    let {error}= listingSchema.validate(req.body.listing);
  
    if(error){
        let errmsg= error.details.map( (el)=> el.message ).join(",");
        throw new ExpressErr(400, errmsg);
    }
    else{
        next();
    }
}
module.exports.validateReview = (req, res, next)=>{
    let {error}= reviewSchema.validate(req.body);
  
    if(error){
        let errmsg= error.details.map( (el)=> el.message ).join(",");
        throw new ExpressErr(400, errmsg);
    }
    else{
        next();
    }
}

 module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
 };
 
 module.exports.isOwner= async (req, res, next)=>{
   let {id}= req.params;
    let listing= await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
 };
 
 module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, rid}= req.params;
    let review = await Review.findById(rid);
    if( !review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
 }