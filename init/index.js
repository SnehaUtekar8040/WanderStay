const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing')
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: '../.env' });
}
const dbUrl = process.env.ATLASDB || 'mongodb://127.0.0.1:27017/wander_lust';

async function main(){
   await mongoose.connect(dbUrl)
}

main().then((res)=>{
    console.log("connected Succesfully")
})
.catch((err)=>{console.log(err)})


async function initDB() {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({
  ...obj,
  owner: "697536f7f8795697b1428fea",
  image: {
    url: obj.image,
    filename: "listingimage"
  }
}));

   await Listing.insertMany(initData.data);
    console.log("Data initialized");
}
initDB();
