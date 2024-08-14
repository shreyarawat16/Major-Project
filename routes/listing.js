const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapasync.js");
const ExpressErr= require("../utils/expresserr.js");
const {listingSchema}= require("../schema.js");
const Listing = require("../modules/listing.js");
const {isOwner, isLoggedIn, validateListing, validateEditListing}= require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer= require("multer");
const {storage} = require("../cloudConfig.js");
const upload= multer({ storage });


router.route("/")
.get( wrapAsync(listingController.index))  //INDEX ROUTE
.post( isLoggedIn,  upload.single('listing[image]'), //IMAGE UPLOAD
wrapAsync(listingController.createListing)); //CREATE ROUTE

//NEW ROUTE
router.get("/new", isLoggedIn, (listingController.newForm));

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn , isOwner,   wrapAsync( listingController.editListing)) ; //EDIT ROUTE

router.route("/:id")
.get( wrapAsync(listingController.showListing))  //SHOW ROUTE
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateEditListing, wrapAsync(listingController.updateListing)) //UPDATE ROUTE
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //DELETE ROUTE

module.exports= router;

//Create route

   // let {title, description, price, location, country} =req.body;
  /* if(!req.body.listing){
    throw new ExpressErr(400, "Send valid data for listing");
   }*/
   
    /*  if(!newlisting.description){
        throw new ExpressErr(400, "description is missing");
    }
    if(!newlisting.title){
        throw new ExpressErr(400, "Title is missing");
    }
    if(!newlisting.location){
        throw new ExpressErr(400, "Location is missing");
    }
*/






