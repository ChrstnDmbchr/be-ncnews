let connectionUrl
const {devUrl, testUrl} = require('./dbconnection');

if (process.env.NODE_ENV !== 'test') connectionUrl = devUrl;
else connectionUrl = testUrl;

const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const morgan = require('morgan');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/apiRoutes');

mongoose.connect(connectionUrl);

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(bodyParser);

app.use('/api', apiRoutes);

module.exports = app; 