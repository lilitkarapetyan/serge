import PouchDB from 'pouchdb-browser';

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
db.changes({
  since: 'now',
  live: true
}).on('change', getAllMessagesFromDB);

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

  var message = {
    _id: new Date().toISOString(),
    details: messageObj,
    schemaId: schemaId,
    completed: false
  };
  return db.put(message)
    .then(function(res) { return res })
}


export function updateMessageInDB(message, id, schemaId) {

  console.log(id);

  return new Promise((resolve, reject) => {
    db.get(id)
      .then(function (doc) {
        console.log(doc);
        return db.put({
          _id: id,
          _rev: doc._rev,
          details: message,
          schemaId
        });
      })
      .catch(function (err) {
        console.log(err);
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
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      if (err) reject('something went wrong');
      resolve(doc);
    });
  });
}