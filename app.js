let db_url
const {dev, test} = require('./dbconnection');

if (process.env.NODE_ENV !== 'test' && !process.env.MONGODB_URI) db_url = dev;
else if (process.env.MONGODB_URI) db_url = process.env.MONGODB_URI
else db_url = test;

const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/apiRoutes');

mongoose.connect(db_url);

app.set('view engine', 'ejs');
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));
app.use(bodyParser);

app.use('/api', apiRoutes);

app.use('/*', (req, res, next) => {
  next({status: 404, error: 'route not found'});
});

app.use((err, req, res, next) => {
  res.status(err.status).send(err);
});

module.exports = app; 