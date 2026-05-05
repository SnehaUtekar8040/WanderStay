const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});
// console.log(typeof passportLocalMongoose);

// ✅ THIS MUST BE A FUNCTION
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
