const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Review = require('./review')
const default_link ='https://images.unsplash.com/photo-1721132447246-5d33f3008b05?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const Listing_Schema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Entire Homes", "Beach", "Mountain", "City", "Nature", "Resorts", "Adventure", "Snow", "Luxury", "Wellness", "Family"]
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        },
    geometry: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
}

})

Listing_Schema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = new mongoose.model("Listing",Listing_Schema)

module.exports = Listing;