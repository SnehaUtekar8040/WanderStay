const mongoose = require('mongoose');

MONGO_URI = "mongodb://snehautekar2005_db_user:iDo2m9lmkp2Zs3yv@ac-7qm85yv-shard-00-00.xgylctf.mongodb.net:27017,ac-7qm85yv-shard-00-01.xgylctf.mongodb.net:27017,ac-7qm85yv-shard-00-02.xgylctf.mongodb.net:27017/?ssl=true&replicaSet=atlas-5pzvgu-shard-0&authSource=admin&appName=Cluster0";

//const MONGO_URI = process.env.MONGO_URI";
console.log('Connecting to:', 'mongodb+srv://snehautekar2005_db_user:iDo2m9lmkp2Zs3yv@cluster0.xgylctf.mongodb.net/?appName=Cluster0');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Successfully connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });