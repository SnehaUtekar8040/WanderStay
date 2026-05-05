if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const session = require('express-session')
const MongoStore = require("connect-mongo").default;

const dbUrl = process.env.MONGO_URL;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const listings = require('./routes/listing')
const reviews = require('./routes/reviews')
const userRoute = require('./routes/userRoute');
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
const flash = require('connect-flash');
app.use(express.static(path.join(__dirname, "public")));
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user')
async function main() {
  await mongoose.connect(dbUrl)
}



app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET_CODE,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});


const sessionOptions = {
  store,
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUnintialized: true,
  cookie: {
    expires: Date.now + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  }
};
app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

app.use('/listings', listings)
app.use('/listings/:id/reviews', reviews)
app.use('/', userRoute);


main().then((res) => {
  console.log("connected Succesfully")
})
  .catch((err) => { console.log(err) })

// app.get('/test',(req,res)=>{
//     const data = new Listing({
//         title:"My New Villa",
//         description:"wowwwwwwwww",
//         price:720000,
//         location:"Mumbai",
//         country:"India"
//     })
//     data.save().then((res)=>console.log(res));
// })

//showw





app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});




app.listen(3000, () => {
  console.log("Server listening at port 3000");


});