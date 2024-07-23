const express= require("express");
const router= express.Router({ mergeParams : true });
const wrapAsync= require("../utils/wrapasync.js");
const ExpressErr= require("../utils/expresserr.js");
const {reviewSchema}= require("../schema.js");
const Listing= require("../modules/listing.js")
const Review = require("../modules/review.js");
const {validateReview, isLoggedIn, isOwner, isReviewAuthor}= require("../middleware.js");
const reviewController= require("../controller/reviews.js");
//REVIEWS
//POST ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//DELETE REVIEW
router.delete("/:rid", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports= router;

