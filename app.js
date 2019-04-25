var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');

app.use(cors());

app.use('/client', express.static(path.join(__dirname, '/client/build')));

app.get('/client/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.use('/message_types', require('express-pouchdb')(require('pouchdb-core')));

//
// app.get('/message_types', function (req, res) {
//   console.log(req);
// });

app.use('/api/wargames', require('./Controllers/WargamesController'));
app.use('/api/messageTypes', require('./Controllers/MessageTypesController'));
app.use('/api/messages', require('./Controllers/MessagesController'));


module.exports = app;
