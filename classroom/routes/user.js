const express= require("express");
const router= express.Router();


//Index- users
router.get("/users", (req, res)=>{
    res.send("GET for users");
});

//Show- users
router.get("/users/:id", (req, res)=>{
    res.send("GET for show users");
});

//Post-users
router.post("/users", (req, res)=>{
    res.send("Post for users");
});

//Delete - users
router.delete("/users/:id", (req, res)=>{
    res.send("Delete for users");
});

module.exports= router;