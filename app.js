const express = require('express');
const app = express();
const bodyParser = require('body-parser').json();
const morgan = require('morgan');

const apiRoutes = require('./routes/apiRoutes');

app.use(morgan('dev'));
app.use(bodyParser);

app.use('/api', apiRoutes);

module.exports = app;