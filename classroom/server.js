const express= require("express");
const app= express();
const cookieParser= require("cookie-parser");

app.use(cookieParser);



app.get("/getcookies", (req, res)=>{
    res.cookie("greet", "namaste"); //cookie is sent as name value pair
    res.cookie("made in india", "roti sabji");
    res.send("sent you some cookies");
});
app.get("/", (req, res)=>{
    console.dir(req.cookies);
    res.send("Hi, I am root");
});

const users= require("./routes/user.js");
const posts= require("./routes/post.js");
//jitne bhi routes pr request ja rhi hai and jo slash users se start horhe hai un saare routes ko match kra jayega unke remaining path se in user.js file
app.use("/users", users); 
app.use("/posts", posts);
app.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
});
