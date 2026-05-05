const Listing = require('./models/listing');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path+" ... "+req.originalUrl)
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    // console.log("hiii")
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};



module.exports.saveRedirectUrl =(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner =async (req,res,next)=>{
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash('error','You dont having permission to edit');
      return  res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewOwner =async (req,res,next)=>{
  const { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash('error','You dont having permission to edit');
      return  res.redirect(`/listings/${id}`);
  }
  next();
}