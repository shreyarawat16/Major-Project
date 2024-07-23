const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapasync.js");
const ExpressErr= require("../utils/expresserr.js");
const {listingSchema}= require("../schema.js");
const Listing = require("../modules/listing.js");
const {isOwner, isLoggedIn, validateListing}= require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer= require("multer");
const upload= multer({ dest: "uploads/"});


router.route("/")
.get( wrapAsync(listingController.index))  //INDEX ROUTE
//.post( isLoggedIn, validateListing, wrapAsync(listingController.createListing)); //CREATE ROUTE
.post(upload.single('listing[image]') , (req, res)=>{
    res.send(req.file);
});

//NEW ROUTE
router.get("/new", isLoggedIn, (listingController.newForm));

router.route("/:id")
.get( wrapAsync(listingController.showListing))  //SHOW ROUTE
.put( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing)) //UPDATE ROUTE
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) //DELETE ROUTE


//EDIT ROUTE
router.get("/:id/edit", isLoggedIn,isOwner,  wrapAsync( listingController.editListing))  //EDIT ROUTE

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
module.exports= router;