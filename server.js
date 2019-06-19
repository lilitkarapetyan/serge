require('events').EventEmitter.defaultMaxListeners = 82;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const uniqid = require('uniqid');
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

let dbDir = './db';

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

let imgDir = './img';
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir);
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

app.get('/deleteDb', (req, res) => {
  fs.unlink('db/'+req.query.db, (err) => {
    console.log(err);
    if (err) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }
  });
});

app.use('/saveIcon', bodyParser.raw({type: 'image/png', limit: '20kb'}));

app.post('/saveIcon', (req, res) => {

  let image = `${imgDir}/${uniqid.time('icon-')}.png`;

  fs.writeFile(image, req.body, (err) => console.log(err));

  res.status(200).send({path: image});

});

app.use(express.static(path.join(__dirname)));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log('App is listening on port ' + port);
