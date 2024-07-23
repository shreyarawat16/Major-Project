const Listing= require("../modules/listing");

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
const newlisting = new Listing(req.body.listing);
console.log(req.user);
newlisting.owner= req.user._id;  
await newlisting.save();
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
    res.render("./listings/edit.ejs", {listing});
};

module.exports.updateListing= async (req, res)=>{
    if(!req.body.listing){
         throw new ExpressErr(400, "Send valid data for listing");
        }
     let {id}= req.params;
    
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success", "Listing updated successfully");
     res.redirect("/listings");            
 };

 module.exports.destroyListing= async (req, res)=>{
    let {id}= req.params;
   let deleted= await Listing.findByIdAndDelete(id);
   console.log(deleted);
   req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};