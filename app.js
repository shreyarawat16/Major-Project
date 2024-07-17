const express= require("express");
const app= express();
const mongoose= require("mongoose");
// const Listing= require("./modules/listing.js");
const methodOverride= require("method-override");
const engine = require("ejs-mate");
const wrapAsync= require("./utils/wrapasync.js");
const ExpressErr= require("./utils/expresserr.js");
// const {listingSchema}= require("./schema.js");
// const {reviewSchema}= require("./schema.js");
const Review = require("./modules/review.js");
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then( (res)=>{
    console.log("connection established");
})
.catch((err)=>{
    console.log(err);
})
const path= require("path");
const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));




app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);

//Standard response(to handle the routes jo abhi create nhi kare hai)
app.all("*", (req, res, next)=>{
    next(new ExpressErr(404, "Page not found"));
});

//error handling middleware
app.use((err, req, res, next)=>{
    let {status=500, message="Something went wrong"}= err;

    res.status(status).render("./listings/error.ejs" ,{ err });
});

app.get("/", (req, res)=>{
    res.send("Hi, I am root");
});

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
});