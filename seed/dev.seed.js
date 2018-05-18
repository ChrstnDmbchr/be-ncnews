const mongoose = require('mongoose');
const { devUrl } = require('../dbconnection');
const dbSeed = require('../seed/seed');

mongoose.connect(devUrl)
.then(() => {
  return dbSeed(devUrl);
})
.then(() => {
  mongoose.disconnect();
})
.catch(err => {
  console.log(err);
})
