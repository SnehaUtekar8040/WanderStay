const Listing = require('../models/listing');
const { listingSchema } = require("../Schema")
const ExpressError = require('../utils/expressError');
const apiKey = process.env.GEOAPIFY_KEY;
module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  let filter = {};

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
      { country: { $regex: q, $options: 'i' } }
    ];
  }

  if (category) {
    filter.category = category;
  }

  const lists = await Listing.find(filter);
  res.render('listings/home', { lists });
}
const axios = require("axios");
module.exports.addListing = async (req, res) => {
  //console.log(req.file)
  let url = req.file.path;
  let filename = req.file.filename;
  const { title, description, price, image, location, country, category } = req.body.listing || req.body;
  const result = listingSchema.validate(req.body)
  const geoRes = await axios.get(
    "https://api.geoapify.com/v1/geocode/search",
    {
      params: {
        text: location,
        apiKey: process.env.GEOAPIFY_KEY
      }
    }
  );

  const feature = geoRes.data.features[0];

  if (!title || !price) {
    throw new ExpressError(400, "Title and Price are required");
  }

  const newVenue = new Listing({
    title,
    description,
    price,
    image,
    location,
    country,
    category,
  });
  newVenue.owner = req.user._id;
  newVenue.image = { url, filename };
  newVenue.geometry = {
    type: "Point",
    coordinates: feature.geometry.coordinates // [lng, lat]
  };
  await newVenue.save();
  req.flash('success', 'New Listing Created');
  res.redirect('/listings');
}

module.exports.showVenue = async (req, res) => {
  const venue = await Listing.findById(req.params.id).populate({
    path: "reviews",
    populate: ({
      path: "author",
    })
  }).populate('owner');

  if (!venue) {
    req.flash('error', 'Listing you requested does not exists');
    res.redirect('/listings');
  }
  // console.log(venue)
  res.render('listings/venue', { venue, apiKey });
}

module.exports.editForm = async (req, res) => {
  const list = await Listing.findById(req.params.id);

  if (!list) {
    req.flash('error', 'Listing you requested does not exists');
    res.redirect('/listings');
  }
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_250"
  );

  res.render('listings/edit', { list, originalImageUrl });
}

module.exports.editVenue = async (req, res) => {
  const { id } = req.params;
  // let listing = await Listing.findById(id);
  // if(!listing.owner._id.equals(res.locals.currUser._id)){
  //   req.flash('error','You dont having permission to edit');
  //     return  res.redirect(`/listings/${id}`);
  // }
  // console.log(req.body.image);
  const updated = await Listing.findByIdAndUpdate(id, {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.loc,
    country: req.body.country,
    category: req.body.category,
  }, { new: true });

  if (typeof req.file != 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    updated.image = { url, filename };
    await updated.save();
  }

  if (!updated) {
    throw new ExpressError(404, "Unable to update listing");
  }

  res.redirect(`/listings/${id}`);
}

module.exports.destroyVenue = async (req, res) => {

  const deleted = await Listing.findByIdAndDelete(req.params.id);

  if (!deleted) {
    throw new ExpressError(404, "Listing not found");
  }

  req.flash('success', 'Venue Deleted')
  res.redirect('/listings');
}