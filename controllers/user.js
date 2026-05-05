
const User = require('../models/user');
module.exports.userSignUp =async(req,res)=>{
    try{
        let {username,email,password}= req.body;
    let newUser=new User({
        email,
        username,
    })
    let response = await User.register(newUser,password);
    //console.log(response);
    req.login(response,(err)=>{
        if(err){
            return next(err);
        }
        req.flash('success',"Welcome to Stay Vista");
        res.redirect('/listings')
    })
    
  }catch(e){
    req.flash('error',e.message);
    res.redirect('/login');
}

}

module.exports.userSignin=async(req,res)=>{
    req.flash('success','Welcome to Stay Vista');
    redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);

}

module.exports.userLogout= (req, res, next) => {
  req.logout((err)=> {
    if (err) {
      return next(err); // ✅ stop execution
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
}