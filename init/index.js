const mongoose= require("mongoose");
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
const Listing= require("../modules/listing.js");
const initData= require("./data.js");

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=> ({...obj, owner: "669d2a0f24251fcdf4ae218f",}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();