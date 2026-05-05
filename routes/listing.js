const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner } = require('../middleware')
// const {listingSchema} = require("../Schema")
// const Listing = require('../models/listing')
const multer = require('multer');
const { storage } = require('../cloudConfig')
const upload = multer({ storage })
const asyncWrap = require('../utils/asyncWrap')
// const ExpressError = require('../utils/expressError');
const { index, addListing, showVenue, editForm, editVenue, destroyVenue } = require('../controllers/listing')


router.route('/')
    .get(asyncWrap(index))
    .post(isLoggedIn, upload.single("image"), asyncWrap(addListing))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new');
})
//add listing



router.route('/:id')
    .get(asyncWrap(showVenue))
    .patch(isLoggedIn, isOwner, upload.single("image"), asyncWrap(editVenue))
    .delete(isLoggedIn, isOwner, asyncWrap(destroyVenue));



//edit route
router.get('/:id/edit', isLoggedIn, asyncWrap(editForm));




module.exports = router;