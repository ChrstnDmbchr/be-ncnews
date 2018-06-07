let connectionUrl
const {devUrl, testUrl} = require('./dbconnection');

if (process.env.NODE_ENV !== 'test' && !process.env.MONGODB_URI) connectionUrl = devUrl;
else if (process.env.MONGODB_URI) connectionUrl = process.env.MONGODB_URI
else connectionUrl = testUrl;

const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/apiRoutes');

mongoose.connect(connectionUrl);

app.set('view engine', 'ejs');
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(bodyParser);

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  res.status(err.status).send(err);
});

module.exports = app; 