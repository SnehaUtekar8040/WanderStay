const express =  require('express');
const router = express.Router({mergeParams:true});

// const Listing = require('../models/listing')
// const Review = require('../models/review')
const asyncWrap = require('../utils/asyncWrap')
const ExpressError = require('../utils/expressError');

const {reviewSchema} = require("../Schema");
const { isLoggedIn, isReviewOwner } = require('../middleware');
const { createReview, destroyReview } = require('../controllers/review');

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.post('/',isLoggedIn,validateReview, asyncWrap(createReview))

router.delete(
  "/:reviewId",isLoggedIn,isReviewOwner,
  asyncWrap(destroyReview)
);

module.exports = router;