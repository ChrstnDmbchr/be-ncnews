process.env.NODE_ENV = 'test'
const mongoose = require('mongoose');
const { testUrl } = require('../dbconnection');
const dbSeed = require('../seed/seed');

mongoose.connect(testUrl)
.then(() => {
  return dbSeed(testUrl);
})
.then(() => {
  mongoose.disconnect();
})
.catch(err => {
  console.log(err);
})