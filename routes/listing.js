const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapasync.js");
const ExpressErr= require("../utils/expresserr.js");
const {listingSchema}= require("../schema.js");
const Listing= require("../modules/listing.js");



const validateListing = (req, res, next)=>{

    let {error}= listingSchema.validate(req.body);
  
    if(error){
        let errmsg= error.details.map( (el)=> el.message ).join(",");
        throw new ExpressErr(400, errmsg);
    }
    else{
        next();
    }
}

//INDEX ROUTE
router.get("/", wrapAsync(async (req, res)=>{
  const listings = await Listing.find({});
    res.render("./listings/index.ejs", {listings});
}));

//NEW ROUTE
router.get("/new", wrapAsync(async (req, res)=>{
    res.render("./listings/newform.ejs");
}));

//Create route
router.post("/", validateListing, wrapAsync(async (req, res, next)=>{
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

const newlisting= new Listing(req.body.listing);

   await newlisting.save();
   res.redirect("/listings");
  
}));


//EDIT ROUTE
router.get("/:id/edit", validateListing, wrapAsync( async (req, res)=>{
    if(!req.body.listing){
        throw new ExpressErr(400, "Send valid data for listing");
       }
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

//UPDATE ROUTE
router.put("/:id", validateListing, wrapAsync(async (req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));


//DELETE ROUTE
router.delete("/:id", wrapAsync(async (req, res)=>{
    let {id}= req.params;
   let deleted= await Listing.findByIdAndDelete(id);
   console.log(deleted);
    res.redirect("/listings");
}));


//SHOW ROUTE
router.get("/:id" , wrapAsync(async (req, res)=>{
   let {id}= req.params;
   const listing = await Listing.findById(id).populate("reviews");
   res.render("./listings/show.ejs", { listing });
}));
module.exports= router;