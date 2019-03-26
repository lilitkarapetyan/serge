import PouchDB from 'pouchdb-browser';
import pouchFind from 'pouchdb-find';

PouchDB.plugin(pouchFind);
var db = new PouchDB('messages');
// var remoteCouch = 'http://couchbase:CUe+1+2n@http://35.245.63.98:8091/messages';


window.clearDatabase2 = function() {
  db.destroy().then(function(res) {
    console.log('database 2 cleared');
  });
};

/*
 * Subscribes to changes to the database, increase max listeners from 10, create db.
 */
db.setMaxListeners(15);
// db.changes({
//   since: 'now',
//   live: true
// }).on('change', getAllMessagesFromDB);

var opts = {live: true};
db.replicate.to(db, opts, () => 'An Error has occurred.');
db.replicate.from(db, opts, () => 'An Error has occurred.');

/*
  for development
 */

// var populateDb = function () {
//   var wargame = {
//     _id: new Date().toISOString(),
//     title: 'wargame schema',
//     details: warGameSchema,
//     completed: false
//   };
//   db.put(wargame);
//
//   setTimeout(function () {
//     var machine = {
//       _id: new Date().toISOString(),
//       title: 'machinery failure',
//       details: machineryFailure,
//       completed: false
//     };
//     db.put(machine);
//   },1000);
//
//   setTimeout(function () {
//     var weather = {
//       _id: new Date().toISOString(),
//       title: 'weather forecast',
//       details: weatherForecast,
//       completed: false
//     };
//     db.put(weather).then(() => {
//       console.log('DATA BASE COMPLETE');
//       window.location.reload(true);
//     });
//   },2000);
// };

// db.allDocs().then(entries => {
//   if (entries.rows.length === 0) {
//     populateDb();
//   }
// });


/**
 * @param message
 * @type object
 */
export function addMessage(messageObj, schemaId) {

  let time = new Date().toISOString();

  var message = {
    _id: time,
    lastUpdated: time,
    details: messageObj,
    schemaId: schemaId,
    completed: false
  };
  return db.put(message)
    .then(function(res) { return res })
}


export function duplicateMessageDB(messageId) {

  let time = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.get(messageId)
      .then(function (doc) {
        return db.put({
          _id: time,
          lastUpdated: time,
          details: doc.details,
          schemaId: doc.schemaId
        });
      })
      .then(function () {
        resolve(true);
      })
      .catch(function (err) {
        console.log(err);
        reject(false);
      })
  });
}


export function updateMessageInDB(message, id) {

  return new Promise((resolve, reject) => {
    db.get(id)
      .then(function (doc) {
        return db.put({
          _id: id,
          lastUpdated: new Date().toISOString(),
          _rev: doc._rev,
          details: message,
          schemaId: doc.schemaId
        });
      })
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        console.log(err);
        reject(false);
      })
  });
}


export function deleteMessageDB(messageId) {
  return new Promise((resolve, reject) => {
    db.get(messageId)
      .then(function (doc) {
        return db.remove(doc);
      })
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        console.log(err);
        reject(false);
      })
  });
}


export function getMessageFromDB(id) {
  return new Promise((resolve, reject) => {
    db.get(id, {include_docs: true}, function(err, doc) {
      if (err) reject('something went wrong');
      resolve(doc);
    });
  });
}

export function getAllMessagesFromDB() {
  return new Promise((resolve, reject) => {

    return db.changes({
      since: 0,
      include_docs: true,
      descending: true,
    })
    .then(function (changes) {

      let results = changes.results.map((a) => a.doc);
          results = results.filter((a) => !a.hasOwnProperty('_deleted') && a.hasOwnProperty('details'));

      resolve(results);
    })
    .catch(function (err) {
      // handle errors
      reject(err);
      console.log(err);
    });

  });
}