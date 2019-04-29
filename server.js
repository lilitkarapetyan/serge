const express = require('express');
const path = require('path');
const PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-adapter-node-websql'))
  .plugin(require('pouchdb-adapter-http'))
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-replication'))
  .defaults({
    prefix: 'db/',
    adapter: 'websql'
  });

const fs = require('fs');

require('pouchdb-all-dbs')(PouchDB);

const cors = require('cors');

const app = express();

app.use(cors());

let dir = './db';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use('/db', require('express-pouchdb')(PouchDB));

app.get('/allDbs', (req, res) => {
  PouchDB.allDbs()
    .then((dbs) => {
      res.send(dbs);
    })
});

app.get('/clearAll', (req, res) => {
  PouchDB.allDbs()
    .then((dbs) => {
      dbs.forEach((db) => {
        new PouchDB(db).destroy();
      })
    })
    .then(() => {
      res.send();
    })
});

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/client/**', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log('App is listening on port ' + port);
