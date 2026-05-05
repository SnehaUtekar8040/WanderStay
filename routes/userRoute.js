const express =  require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const { userSignUp, userSignin, userLogout } = require('../controllers/user');

router.route('/signup')
.get((req,res)=>{
    res.render("users/signup");
})
.post(asyncWrap( userSignUp));


router.route('/login')
.get((req,res)=>{
    res.render('users/login')
})
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userSignin)


router

router.get("/logout",userLogout);


module.exports = router;