const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const express = require('express');
const cors = require('cors');
const errorhandler = require('errorhandler');

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.use(errorhandler());

require('./db');
require('./models/Character');

app.use(require('./routes'));
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

app.use(function(err, req, res, next) {
  console.log(err.stack);

  res.status(err.status || 500);

  res.json({'errors': {
    message: err.message,
    error: err
  }});
});

var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
