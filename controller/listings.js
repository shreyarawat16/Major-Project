const Listing= require("../modules/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index= async (req, res)=>{
    const listings = await Listing.find({});
      res.render("./listings/index.ejs", {listings});
};

module.exports.newForm= async (req, res)=>{
    res.render("./listings/newform.ejs");
}

module.exports.showListing= async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate:{path: "author"}}).populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
 };


module.exports.createListing = async(req, res, next)=>{
 let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location, //jegeh ka naam denge query me
    limit: 1  //sirf ek possible coordinate return hokr ayega
  })
    .send();
  //console.log(response.body.features[0].geometry.coordinates);
  
let url =req.file.path;
let filename= req.file.filename;
const newlisting = new Listing(req.body.listing);
newlisting.owner= req.user._id;  
newlisting.image= {url, filename};
newlisting.geometry= response.body.features[0].geometry;
let savedListing = await newlisting.save();
console.log(savedListing);
   req.flash("success", "New listing created"); //key, message
   res.redirect("/listings");
}

module.exports.editListing= async (req, res)=>{
    
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
      }
    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", {listing, originalImageURL});
};

module.exports.updateListing= async (req, res)=>{
     let {id}= req.params;
    let newlisting= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
     let url =req.file.path;
     let filename= req.file.filename;
     newlisting.image= {url, filename}; 
     await newlisting.save(); 
    }
     req.flash("success", "Listing updated successfully");
     res.redirect(`/listings/${id}`);            
 };

 module.exports.destroyListing= async (req, res)=>{
    let {id}= req.params;
   let deleted= await Listing.findByIdAndDelete(id);
   console.log(deleted);
   req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};