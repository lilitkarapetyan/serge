var chalk = require('chalk');
var app = require('./app');
var port = process.env.PORT || 5000;
var path = require('path');

var server = app.listen(port, function() {
  console.log(chalk.greenBright(`Pouchdb server on port`), chalk.greenBright.bold(port));
});
