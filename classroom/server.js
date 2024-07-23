const express= require("express");
const app= express();
const flash= require("connect-flash");
const path= require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//const cookieParser= require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res)=>{
//  res.cookie("color", "red", {signed: true});
//  res.send("Signed cookie send");
// });
// app.get("/verify", (req, res)=>{
//     console.log(req.cookies); //to access unsigned cookies
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// app.get("/greet", (req, res)=>{
//     let {name= "anonymous"}= req.cookies;
//     res.send(`Hi, ${name}`);
// });

// app.get("/getcookies", (req, res)=>{
//     res.cookie("greet", "namaste"); //cookie is sent as name value pair
//     res.cookie("made in india", "roti sabji");
//     res.send("sent you some cookies");
// });


// app.get("/", (req, res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I am root");
// });

const session= require("express-session");
const sessionOptions= {
    secret: "mysuperstring",
    resave: false,
    saveUninitialized: true,
}
app.use(session(sessionOptions));
app.use(flash());

//Middleware
app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success"); 
    res.locals.errorMsg = req.flash("error"); 
    next();
});
//STORING AND USING INFORMATION
app.get("/register", (req, res)=>{
  let {name="anonymous"}= req.query;
  req.session.name= name;
  
  if(name=== "anonymous"){
    req.flash("error", "User not registered"); //key, message
  }
  else{
    req.flash("success", "User registered successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res)=>{
   res.render("page.ejs", {name: req.session.name});
});
// app.get("/reqcount", (req, res)=>{
//     req.session.count = (req.session.count || 0) + 1;
//     res.send(`you sent a request ${req.session.count} times`);
// });

const users= require("./routes/user.js");
const posts= require("./routes/post.js");
//jitne bhi routes pr request ja rhi hai and jo slash users se start horhe hai un saare routes ko match kra jayega unke remaining path se in user.js file
app.use("/users", users); 
app.use("/posts", posts);

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
});
